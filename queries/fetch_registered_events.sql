--this is for test
SELECT * FROM event WHERE eventId in
(SELECT eventId FROM registerEvent WHERE userId in
(SELECT userId FROM user WHERE mailId = 'foramvadher'))
and event_date>= date('now')
