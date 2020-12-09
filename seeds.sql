USE employeetracker_db;

INSERT INTO department (name)
VALUES ("Clothing");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Electronics");

INSERT INTO department (name)
VALUES ("Grocery");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 45000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Consultant", 28000 , 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Home Theater Manager", 32000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Home Theater Expert", 25000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, null );

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Bags", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Benedict", "Cumberbatch", 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Ross", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mel", "Brooks", 3, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dave", "Chappelle", 2, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cary", "Elwes", 2, 5);