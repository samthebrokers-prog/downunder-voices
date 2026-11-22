#!/usr/bin/env python3
"""Loads the Supabase export (sent by pg_net into /opt/dvimport) into the local dv database."""
import glob, json, os, re, psycopg2

D = '/opt/dvimport'
conn = psycopg2.connect(dbname='dv', user='postgres', host='/var/run/postgresql')
conn.autocommit = True
cur = conn.cursor()

schema = json.load(open(f'{D}/schema'))
extras = json.load(open(f'{D}/constraints'))
tables = {}
for c in sorted(schema, key=lambda r: (r['table_name'], r['ordinal_position'])):
    tables.setdefault(c['table_name'], []).append(c)

def coltype(c):
    if c['data_type'] == 'ARRAY':
        return c['udt_name'].lstrip('_') + '[]'
    if c['data_type'] == 'USER-DEFINED':
        return 'text'
    return c['data_type']

for t, cols in tables.items():
    defs = []
    for c in cols:
        d = f'"{c["column_name"]}" {coltype(c)}'
        default = c.get('column_default')
        if default and 'nextval' in default:
            seq = f'{t}_{c["column_name"]}_seq'
            cur.execute(f'create sequence if not exists "{seq}"')
            default = f"nextval('\"{seq}\"'::regclass)"
        if default:
            d += f' default {default}'
        if c['is_nullable'] == 'NO':
            d += ' not null'
        defs.append(d)
    cur.execute(f'drop table if exists "{t}" cascade')
    cur.execute(f'create table "{t}" ({", ".join(defs)})')
    print('created', t, flush=True)

for t in tables:
    files = sorted(glob.glob(f'{D}/data.{t}.*'), key=lambda p: int(p.rsplit('.', 1)[1]))
    n = 0
    for f in files:
        body = open(f, encoding='utf-8').read()
        if body.strip() in ('', 'null'):
            continue
        cur.execute(f'insert into "{t}" select * from jsonb_populate_recordset(null::"{t}", %s::jsonb)', (body,))
        n += cur.rowcount
    cur.execute(f'select count(*) from "{t}"')
    print(f'loaded {t}: inserted {n}, now {cur.fetchone()[0]} rows from {len(files)} files', flush=True)

for kind in ('p', 'u', 'c', 'f'):
    for x in extras['constraints']:
        if x['contype'] != kind:
            continue
        try:
            cur.execute(f'alter table "{x["table_name"]}" add constraint "{x["conname"]}" {x["def"]}')
        except Exception as e:
            print('constraint skipped', x['conname'], str(e).splitlines()[0], flush=True)
for x in extras['indexes']:
    try:
        cur.execute(x['indexdef'].replace('CREATE INDEX', 'CREATE INDEX IF NOT EXISTS').replace('CREATE UNIQUE INDEX', 'CREATE UNIQUE INDEX IF NOT EXISTS'))
    except Exception as e:
        print('index skipped', x['indexname'], str(e).splitlines()[0], flush=True)

# sequences continue after the highest id
cur.execute("""select table_name, column_name, column_default from information_schema.columns
               where table_schema='public' and column_default like 'nextval%'""")
for t, c, dflt in cur.fetchall():
    seq = re.search(r"nextval\('(.+?)'", dflt).group(1)
    cur.execute(f"select setval('{seq}', coalesce((select max(\"{c}\") from \"{t}\"), 0) + 1, false)")

cur.execute('grant all on all tables in schema public to service_role')
cur.execute('grant all on all sequences in schema public to service_role')
cur.execute("notify pgrst, 'reload schema'")
print('LOAD COMPLETE', flush=True)
