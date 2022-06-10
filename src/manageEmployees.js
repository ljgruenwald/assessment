"use strict";
exports.__esModule = true;
exports.generateCompanyStructure = exports.TreeNode = void 0;
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
    // console.log(newEmployee)
    if (newEmployee.name.indexOf("@") !== -1 && newEmployee.name.indexOf(".") !== -1) {
        // if we assume email is the only other invalid input type
        // and we assume the first half of email is their name...
        newEmployee = fixName(newEmployee);
    }
    ;
    if (bossName !== null) {
        var bossNode = (0, getEmployees_1.getBoss)(tree, newEmployee.name, bossName);
        // console.log(`bossNode is ${bossNode}`)
    }
    var newEmployeeNode = new TreeNode(newEmployee.name, newEmployee.jobTitle, bossNode, parseInt(newEmployee.salary));
    // console.log(`boss node is ${bossNode}`)
    // console.log("----")
    // if they have a boss, add them to descendants 
    if (bossNode) {
        bossNode.descendants.push(newEmployeeNode);
        console.log("pushed into descendants");
    }
    console.log("[hireEmployee]: Added new employee (".concat(newEmployee.name, ") \n    with ").concat(bossName, " as their boss"));
    // console.log(tree)
}
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
    var highPerformer = (0, getEmployees_1.getEmployeeByName)(tree, employeeName);
    var highDescendants = highPerformer.descendants;
    var lowPerformer = highPerformer.boss;
    var lowDescendants = lowPerformer.descendants;
    var nodeAbove = lowPerformer.boss;
    nodeAbove.descendants.push(highPerformer);
    var index = nodeAbove.descendants.indexOf(lowPerformer);
    if (index > -1) {
        nodeAbove.descendants.splice(index, 1);
    }
    highPerformer.descendants = lowDescendants;
    index = highPerformer.descendants.indexOf(highPerformer);
    if (index > -1) {
        highPerformer.descendants.splice(index, 1);
    }
    lowPerformer.descendants = highDescendants;
    index = lowPerformer.descendants.indexOf(lowPerformer);
    if (index > -1) {
        lowPerformer.descendants.splice(index, 1);
    }
    // assign boss
    highPerformer.boss = nodeAbove;
    lowPerformer.boss = highPerformer;
    console.log("[promoteEmployee]: Promoted ".concat(highPerformer, " and made ").concat(lowPerformer, " their subordinate"));
}
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
    var lowPerformer = (0, getEmployees_1.getEmployeeByName)(tree, employeeName);
    var highPerformer = (0, getEmployees_1.getEmployeeByName)(tree, subordinateName);
    // need to have a subordinate available to make it possible to demote
    if (lowPerformer.descendants.length > 0) {
        var highDescendants = highPerformer.descendants;
        var lowDescendants = lowPerformer.descendants;
        var nodeAbove = lowPerformer.boss;
        nodeAbove.descendants.push(highPerformer);
        var index = nodeAbove.descendants.indexOf(lowPerformer);
        if (index > -1) {
            nodeAbove.descendants.splice(index, 1);
        }
        highPerformer.descendants = lowDescendants;
        index = highPerformer.descendants.indexOf(highPerformer);
        if (index > -1) {
            highPerformer.descendants.splice(index, 1);
        }
        lowPerformer.descendants = highDescendants;
        index = lowPerformer.descendants.indexOf(lowPerformer);
        if (index > -1) {
            lowPerformer.descendants.splice(index, 1);
        }
        // assign boss
        highPerformer.boss = nodeAbove;
        lowPerformer.boss = highPerformer;
    }
    else {
        console.log("no further demotions possible");
        // maybe fire them in this scenario?
    }
    console.log("[demoteEmployee]: Demoted employee (demoted ".concat(lowPerformer, " and replaced with ").concat(highPerformer, ")"));
}
var testArray = [
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
var treeTest = generateCompanyStructure(testArray);
console.log(treeTest);
console.log(fireEmployee(treeTest, "Xavier"));
console.log(fireEmployee(treeTest, "Maria"));
console.log(fireEmployee(treeTest, "Morty"));
console.log(fireEmployee(treeTest, "Bill"));
console.log(fireEmployee(treeTest, "Rick"));
console.log(fireEmployee(treeTest, "Jared"));
console.log(fireEmployee(treeTest, "Nick"));
console.log(fireEmployee(treeTest, "Sal"));
console.log(fireEmployee(treeTest, "Alicia"));
console.log(treeTest);
