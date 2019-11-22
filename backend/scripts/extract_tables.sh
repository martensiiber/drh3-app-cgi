#!/bin/bash
for user_id in {1..56}
do
cat << EOF | psql -d newdb
\t
\a
\o './all_new_adr/src_id_'$user_id'_to_adr.json'
select json_agg(t) FROM (SELECT * FROM kysitleja_to_adr_roadcosts_epyc_truly420_eof$user_id) t;
EOF
done


