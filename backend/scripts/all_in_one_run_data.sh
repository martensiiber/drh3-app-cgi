#!/bin/bash
for user_id in {1..56}
do
cat << EOF | psql -d newdb

CREATE TABLE kysitleja_to_adr_roadcosts_epyc_truly420_eoF$user_id AS WITH
gr_circle_ads as (
	SELECT a.kysitleja_id AS src_id,
		   closest_vertex_to_point(a.adr_xy) AS src_vid,
		   b.adr_id AS target_id,
		   closest_vertex_to_point(b.adr_xy) AS target_vid
	    FROM kysitlejad a, adr_valim_xy_aggr b
		WHERE a.kysitleja_id = $user_id AND ST_DWithin(a.adr_xy, b.adr_xy, 25000)
),
gr_aggregated AS (
	SELECT src_vid, array_agg(target_vid) AS targets
    FROM gr_circle_ads
	GROUP BY src_vid
)
SELECT a.src_id, a.target_id, b.agg_cost FROM gr_circle_ads AS a
INNER JOIN
(SELECT * FROM gr_aggregated, pgr_dijkstraCost(
    'select gid AS id, source, target, length_m AS cost, length_m*sign(reverse_cost) AS reverse_cost from osm.estways',
    gr_aggregated.src_vid, gr_aggregated.targets)) AS b
ON a.src_vid = b.start_vid AND a.target_vid = b.end_vid;
EOF
done
