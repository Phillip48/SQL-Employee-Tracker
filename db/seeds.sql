USE employees;

INSERT INTO department
    (name)
VALUES
    ("Engineering")
    ("Human Resources")
    ("Warehouse")
    ("Legal")

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Senior Developer", 100000, 1),
    ("HR Business Partner", 200000, 2),
    ("Operations Manager", 110000, 3),
    ("Lawyer", 90000, 4)

INSERT INTO employees
    (first_name, last_name, role_id)
VALUES
    ("Bob", "TheBuilder", 1),
    ("Dora", "TheExplorer", 2),
    ("Rocket", "Raccoon", 3),
    ("Tony", "Stank", 4),