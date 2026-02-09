-- Users
INSERT INTO USERS (id, email, last_name, first_name, password, admin) VALUES (1, 'test@example.com', 'Doe', 'Test', 'testpassword', false);
INSERT INTO USERS (id, email, last_name, first_name, password, admin) VALUES (2, 'other@example.com', 'Smith', 'Other', 'otherpassword', false);

-- Teachers
INSERT INTO TEACHERS (id, last_name, first_name) VALUES (1, 'TeacherLast', 'TeacherFirst');

-- Sessions (use SQL TIMESTAMP literal compatible with H2)
INSERT INTO SESSIONS (id, name, date, description, teacher_id) VALUES (1, 'Morning Yoga', TIMESTAMP '2020-01-01 00:00:00', 'Relaxing morning session', 1);

-- Participation
INSERT INTO PARTICIPATE (session_id, user_id) VALUES (1, 2);
