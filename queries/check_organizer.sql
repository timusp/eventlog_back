--check organizer
SELECT organizerId FROM organizer WHERE userId in
(SELECT userId FROM user where mailId = 'foramvadher')