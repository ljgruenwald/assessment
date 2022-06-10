"use strict";
exports.__esModule = true;
exports.demoteEmployee = exports.promoteEmployee = exports.fireEmployee = exports.hireEmployee = exports.generateCompanyStructure = exports.TreeNode = void 0;
var getEmployees_1 = require("./getEmployees");
var TreeNode = /** @class */ (function () {
    function TreeNode(name, jobTitle, boss, salary) {
        this.name = name;
        this.jobTitle = jobTitle;
        this.boss = boss;
        this.salary = salary;
        this.descendants = [];
    }
    return TreeNode;
}());
exports.TreeNode = TreeNode;
/**
 * Normalizes the provided JSON file and generates a tree of employees.
 *
 * @param {Object[]} employees array of employees
 * @returns {TreeNode}
 */
function generateCompanyStructure(employees) {
    // find the ceo and start the tree with them
    var ceo = employees.filter(function (employee) { return employee.jobTitle === "CEO"; })[0];
    var root = new TreeNode(ceo.name, ceo.jobTitle, null, parseInt(ceo.salary));
    console.log("Generating employee tree...");
    // hire the plebs
    employees.slice(1).forEach(function (pleb) {
        hireEmployee(root, pleb, pleb.boss);
    });
    return root;
}
exports.generateCompanyStructure = generateCompanyStructure;
/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param {TreeNode} tree
 * @param {Object} newEmployee
 * @param {string} bossName
 * @returns {void}
 */
function hireEmployee(tree, newEmployee, bossName) {
    if (newEmployee.name.indexOf("@") !== -1 && newEmployee.name.indexOf(".") !== -1) {
        // if we assume email is the only other invalid input type
        // and we assume the first half of email is their name...
        newEmployee = fixName(newEmployee);
    }
    ;
    if (bossName !== null) {
        var bossNode = (0, getEmployees_1.getBoss)(tree, newEmployee.name, bossName);
    }
    var newEmployeeNode = new TreeNode(newEmployee.name, newEmployee.jobTitle, bossNode, parseInt(newEmployee.salary));
    if (bossNode) {
        bossNode.descendants.push(newEmployeeNode);
    }
    console.log("[hireEmployee]: Added new employee (".concat(newEmployee.name, ") \n    with ").concat(bossName, " as their boss"));
}
exports.hireEmployee = hireEmployee;
function fixName(newEmployee) {
    var invalidName = newEmployee.name;
    var front = invalidName.split("@")[0];
    var capitalized = front[0].toUpperCase() + front.slice(1);
    newEmployee.name = capitalized;
    return newEmployee;
}
// function swapNodes(moveUp: TreeNode, moveDown: TreeNode): void {
//  possible future function to share code for various swaps
// }
/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * @param {TreeNode} tree
 * @param {string} name employee's name
 * @returns {void}
 */
function fireEmployee(tree, name) {
    // find your employee node to remove 
    var fireMe = (0, getEmployees_1.getEmployeeByName)(tree, name);
    // if employee has subordinates, promote a random one 
    if (fireMe.descendants.length > 0) {
        var toPromote = fireMe.descendants[0];
        var inherited = fireMe.descendants.slice(1);
        fireMe.boss.descendants.push(toPromote);
        toPromote.descendants = toPromote.descendants.concat(inherited);
        toPromote.boss = fireMe.boss;
        var index = fireMe.boss.descendants.indexOf(fireMe);
        if (index > -1) {
            fireMe.boss.descendants.splice(index, 1);
        }
        console.log("[fireEmployee]: Fired ".concat(fireMe.name, " and replaced with ").concat(toPromote.name));
    }
    else {
        var index = fireMe.boss.descendants.indexOf(fireMe);
        if (index > -1) {
            fireMe.boss.descendants.splice(index, 1);
        }
    }
}
exports.fireEmployee = fireEmployee;
/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {void}
 */
function promoteEmployee(tree, employeeName) {
    // first find your employee node to promote
    var promoteMe = (0, getEmployees_1.getEmployeeByName)(tree, employeeName);
    var promotedDescendants = promoteMe.descendants;
    var demoteMe = promoteMe.boss;
    var demotedDescendants = demoteMe.descendants;
    var nodeAbove = demoteMe.boss;
    if (nodeAbove) {
        nodeAbove.descendants.push(promoteMe);
        var index = nodeAbove.descendants.indexOf(demoteMe);
        if (index > -1) {
            nodeAbove.descendants.splice(index, 1);
        }
    }
    promoteMe.descendants = demotedDescendants;
    promoteMe.descendants.push(demoteMe);
    index = promoteMe.descendants.indexOf(promoteMe);
    if (index > -1) {
        promoteMe.descendants.splice(index, 1);
    }
    // inform everyone of their new boss
    for (var _i = 0, _a = promoteMe.descendants; _i < _a.length; _i++) {
        var child = _a[_i];
        child.boss = promoteMe;
    }
    demoteMe.descendants = promotedDescendants;
    index = demoteMe.descendants.indexOf(demoteMe);
    if (index > -1) {
        demoteMe.descendants.splice(index, 1);
    }
    // assign boss to promoted employee
    promoteMe.boss = nodeAbove;
    demoteMe.boss = promoteMe;
    // swap job title
    var tempJob = promoteMe.jobTitle;
    promoteMe.jobTitle = demoteMe.jobTitle;
    demoteMe.jobTitle = tempJob;
    // swap salary
    var tempSalary = promoteMe.salary;
    promoteMe.salary = demoteMe.salary;
    demoteMe.salary = tempSalary;
    console.log("[promoteEmployee]: Promoted ".concat(promoteMe.name, " and made ").concat(demoteMe.name, " their subordinate"));
}
exports.promoteEmployee = promoteEmployee;
/**
 * Demotes an employee one level below their current ranking.
 * Picks a subordinat and swaps places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName the employee getting demoted
 * @param {string} subordinateName the new boss
 * @returns {void}
 */
function demoteEmployee(tree, employeeName, subordinateName) {
    // similar to promotion, we are swapping two nodes 
    var demoteMe = (0, getEmployees_1.getEmployeeByName)(tree, employeeName);
    var promoteMe = (0, getEmployees_1.getEmployeeByName)(tree, subordinateName);
    // need to have a subordinate available to make it possible to demote
    if (demoteMe.descendants.length) {
        var promotedDescendants = promoteMe.descendants;
        var demotedDescendants = demoteMe.descendants;
        if (demoteMe.boss) {
            var nodeAbove = demoteMe.boss;
            nodeAbove.descendants.push(promoteMe);
            var index = nodeAbove.descendants.indexOf(demoteMe);
            if (index > -1) {
                nodeAbove.descendants.splice(index, 1);
            }
        }
        promoteMe.descendants = demotedDescendants;
        promoteMe.descendants.push(demoteMe);
        index = promoteMe.descendants.indexOf(promoteMe);
        if (index > -1) {
            promoteMe.descendants.splice(index, 1);
        }
        // inform everyone of their new boss
        for (var _i = 0, _a = promoteMe.descendants; _i < _a.length; _i++) {
            var child = _a[_i];
            child.boss = promoteMe;
        }
        demoteMe.descendants = promotedDescendants;
        index = demoteMe.descendants.indexOf(demoteMe);
        if (index > -1) {
            demoteMe.descendants.splice(index, 1);
        }
        // assign boss
        promoteMe.boss = nodeAbove;
        demoteMe.boss = promoteMe;
        // swap job title
        var tempJob = promoteMe.jobTitle;
        promoteMe.jobTitle = demoteMe.jobTitle;
        demoteMe.jobTitle = tempJob;
        // swap salary
        var tempSalary = promoteMe.salary;
        promoteMe.salary = demoteMe.salary;
        demoteMe.salary = tempSalary;
    }
    else {
        console.log("no further demotions possible");
        // maybe fire them in this scenario?
    }
    console.log("[demoteEmployee]: Demoted employee (demoted ".concat(demoteMe.name, " and replaced with ").concat(promoteMe.name, ")"));
}
exports.demoteEmployee = demoteEmployee;
var employees = [
    {
        "name": "Sarah",
        "jobTitle": "CEO",
        "boss": null,
        "salary": "200000"
    },
    {
        "name": "xavier@dundermifflin.net",
        "jobTitle": "Sales Operator",
        "boss": "Sarah",
        "salary": "100000"
    },
    {
        "name": "Alicia",
        "jobTitle": "Brand Manager",
        "boss": "Sarah",
        "salary": "50000"
    },
    {
        "name": "Kelly",
        "jobTitle": "Marketing Specialist",
        "boss": "Alicia",
        "salary": "49000"
    },
    {
        "name": "Sal",
        "jobTitle": "Outreach Specialist",
        "boss": "Alicia",
        "salary": "45000"
    },
    {
        "name": "rick@astley.com",
        "jobTitle": "Moral Support Specialist",
        "boss": "Alicia",
        "salary": "1000"
    },
    {
        "name": "Maria",
        "jobTitle": "Market Researcher",
        "boss": "Xavier",
        "salary": "70000"
    },
    {
        "name": "Morty",
        "jobTitle": "Advenurer",
        "boss": "Xavier",
        "salary": "-10"
    },
    {
        "name": "Bill",
        "jobTitle": "Janitor?",
        "boss": "Xavier",
        "salary": "400000"
    },
    {
        "name": "jared@piedpiper.com",
        "jobTitle": "Assistant",
        "boss": "Bill",
        "salary": "20000"
    },
    {
        "name": "Nick",
        "jobTitle": "Developer",
        "boss": "Bill",
        "salary": "60000"
    }
];
var jebNode = {
    "name": "Jeb",
    "jobTitle": "Florida Governor",
    "boss": "Sarah",
    "salary": "150000"
};
var tree = generateCompanyStructure(employees);
console.log('.');
console.log("--- INITIAL TREE NOW FULLY GENERATED ---");
console.log('.');
hireEmployee(tree, jebNode, "Sarah");
fireEmployee(tree, "Alicia");
promoteEmployee(tree, "Jared");
demoteEmployee(tree, "Xavier", "Maria");
(0, getEmployees_1.getBoss)(tree, "Bill", "Jared");
(0, getEmployees_1.getSubordinates)(tree, "Jeb");
// console.log(getEmployeeByName(tree, "Jeb"))
