alter table "public"."order_tracking" replica identity full;
alter publication supabase_realtime add table "public"."order_tracking";