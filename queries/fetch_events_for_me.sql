SELECT * FROM event WHERE clubId in 
(SELECT clubId FROM insterested_club WHERE userId in (
 SELECT userId FROM user WHERE mailId = 'foramvadher'))
 and event_date >= date('now')