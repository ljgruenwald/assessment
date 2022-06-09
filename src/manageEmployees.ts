import { getBoss, getSubordinates, getEmployeeByName } from './getEmployees'

export class TreeNode {
    name: string;
    jobTitle: string;
    boss: TreeNode;
    salary: number;
    descendants: TreeNode[];
    constructor(name: string, jobTitle: string, boss: TreeNode, salary: number) {
        this.name = name;
        this.jobTitle = jobTitle;
        this.boss = boss;
        this.salary = salary;
        this.descendants = [];
    }
}

export type Employee = {
    name: string;
    jobTitle: string;
    boss: TreeNode;
    salary: string;
}

type employeeJson = {
    name: string;
    jobTitle: string;
    boss: string;
    salary: string;
}

/**
 * Normalizes the provided JSON file and generates a tree of employees.
 *
 * @param {Object[]} employees array of employees
 * @returns {TreeNode}
 */
function generateCompanyStructure(employees: employeeJson[]): TreeNode {
    // hire everyone using the array of employee objects

    // find the ceo and start the tree with them
    const ceo = employees.find((employee: employeeJson) => employee.jobTitle === "CEO");
    const root = new TreeNode(ceo.name, ceo.jobTitle, null, parseInt(ceo.salary));

    console.log("Generating employee tree...");

    // hire the plebs
    employees.slice(1).forEach((pleb: employeeJson) => {
        hireEmployee(root, pleb, pleb.boss)
    });

    return root;
}

/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param {TreeNode} tree
 * @param {Object} newEmployee
 * @param {string} bossName
 * @returns {void}
 */
function hireEmployee(tree: TreeNode, newEmployee: employeeJson, bossName: string): void {
    if (newEmployee.name.includes("@") && newEmployee.name.includes(".")){
        // if we assume email is the only other invalid input type
        // and we assume the first half of email is their name...
        newEmployee = fixName(newEmployee);
    };

    let bossNode = getBoss(tree, newEmployee.name)

    const newEmployeeNode = new TreeNode(
        newEmployee.name, 
        newEmployee.jobTitle,
        bossNode,
        parseInt(newEmployee.salary),
    );

    // if they have a boss, add them to descendants 
    bossNode.descendants.push(newEmployeeNode);

    console.log(`[hireEmployee]: Added new employee (${newEmployee.name}) 
    with ${bossName} as their boss`);
}

function fixName(newEmployee: employeeJson): employeeJson{
    let invalidName = newEmployee.name;
    let front = invalidName.split("@")[0];
    const capitalized = front[0].toUpperCase() + front.slice(1);
    newEmployee.name = capitalized;
    return newEmployee;
}
/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * @param {TreeNode} tree
 * @param {string} name employee's name
 * @returns {void}
 */
function fireEmployee(tree: TreeNode, name: string): void {

    // find your employee node to remove 
    const slacker = getEmployeeByName(tree, name); 

    // if employee has subordinates, promote a random one while firing slacker
    // else just remove the employee 
    let subordinates = getSubordinates(tree, name);
    if (subordinates.length > 0){
        // promote a subordinate and adjust their data as needed
        // overwrite the fired boss
    } else {
        // if no subordinates, just delete the node;
    }

    // console.log your action
}

/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {void}
 */
function promoteEmployee(tree: TreeNode, employeeName: string): void {
    // first find your employee node to promote
    const highPerformer = getEmployeeByName(tree, employeeName);

    // find their boss to demote 
    const lowPerformer = highPerformer.boss

    // swap the two nodes, adjusting their data as needed

    // console.log it
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
function demoteEmployee(tree: TreeNode, employeeName: string, subordinateName: string): void {
    // similar to promotion, we are swapping two nodes 
    const lowPerformer = getEmployeeByName(tree, employeeName);

    // need to have a subordinate available to make it possible to demote
    if (lowPerformer.descendants.length > 0){
        
        let highPerformer = lowPerformer.descendants[0]

        // swap the two nodes, adjust their data as needed

    } else {
        console.log("no further demotions possible")

        // maybe fire them in this scenario?
    }

    // console.log it 
}
