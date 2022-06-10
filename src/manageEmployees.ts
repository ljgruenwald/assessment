import { getBoss, getEmployeeByName } from './getEmployees'

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
export function generateCompanyStructure(employees: employeeJson[]): TreeNode {

    // find the ceo and start the tree with them
    const ceo = employees.filter((employee) => employee.jobTitle === "CEO")[0];
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
    // console.log(newEmployee)
    if (newEmployee.name.indexOf("@") !== -1 && newEmployee.name.indexOf(".") !== -1){
        // if we assume email is the only other invalid input type
        // and we assume the first half of email is their name...
        newEmployee = fixName(newEmployee);
    };
    if (bossName !== null){
        var bossNode = getBoss(tree, newEmployee.name, bossName)
        // console.log(`bossNode is ${bossNode}`)
    }

    const newEmployeeNode = new TreeNode(
        newEmployee.name, 
        newEmployee.jobTitle,
        bossNode,
        parseInt(newEmployee.salary),
    );
    // console.log(`boss node is ${bossNode}`)
    // console.log("----")
    // if they have a boss, add them to descendants 
    if (bossNode){
        bossNode.descendants.push(newEmployeeNode);
        console.log("pushed into descendants")
    }

    console.log(`[hireEmployee]: Added new employee (${newEmployee.name}) 
    with ${bossName} as their boss`);
    // console.log(tree)
}

function fixName(newEmployee: employeeJson): employeeJson{
    let invalidName = newEmployee.name;
    let front = invalidName.split("@")[0];
    const capitalized = front[0].toUpperCase() + front.slice(1);
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
function fireEmployee(tree: TreeNode, name: string): void {

    // find your employee node to remove 
    const fireMe = getEmployeeByName(tree, name); 

    // if employee has subordinates, promote a random one 
    if (fireMe.descendants.length > 0){
        const toPromote = fireMe.descendants[0]
        const inherited = fireMe.descendants.slice(1);
        fireMe.boss.descendants.push(toPromote);
        toPromote.descendants.concat(inherited);
        toPromote.boss = fireMe.boss;
        const index = fireMe.boss.descendants.indexOf(fireMe);
        if (index > -1) {
            fireMe.boss.descendants.splice(index, 1);
        }
        console.log(`[fireEmployee]: Fired ${fireMe} and replaced with ${toPromote.name}`);
    } else {
        const index = fireMe.boss.descendants.indexOf(fireMe);
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
function promoteEmployee(tree: TreeNode, employeeName: string): void {
    // first find your employee node to promote
    const highPerformer = getEmployeeByName(tree, employeeName);
    const highDescendants = highPerformer.descendants
    const lowPerformer = highPerformer.boss
    const lowDescendants = lowPerformer.descendants
    const nodeAbove = lowPerformer.boss;
    
    nodeAbove.descendants.push(highPerformer);
    let index = nodeAbove.descendants.indexOf(lowPerformer)
    if (index > -1) {
        nodeAbove.descendants.splice(index, 1);
    }

    highPerformer.descendants = lowDescendants
    index = highPerformer.descendants.indexOf(highPerformer)
    if (index > -1) {
        highPerformer.descendants.splice(index, 1);
    }

    lowPerformer.descendants = highDescendants
    index = lowPerformer.descendants.indexOf(lowPerformer)
    if (index > -1) {
        lowPerformer.descendants.splice(index, 1);
    }

    // assign boss
    highPerformer.boss = nodeAbove
    lowPerformer.boss = highPerformer

    console.log(`[promoteEmployee]: Promoted ${highPerformer} and made ${lowPerformer} their subordinate`);
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
    const highPerformer = getEmployeeByName(tree, subordinateName);

    // need to have a subordinate available to make it possible to demote
    if (lowPerformer.descendants.length > 0){
        
        const highDescendants = highPerformer.descendants
        const lowDescendants = lowPerformer.descendants
        const nodeAbove = lowPerformer.boss;

        nodeAbove.descendants.push(highPerformer);
        let index = nodeAbove.descendants.indexOf(lowPerformer)
        if (index > -1) {
            nodeAbove.descendants.splice(index, 1);
        }

        highPerformer.descendants = lowDescendants
        index = highPerformer.descendants.indexOf(highPerformer)
        if (index > -1) {
            highPerformer.descendants.splice(index, 1);
        }

        lowPerformer.descendants = highDescendants
        index = lowPerformer.descendants.indexOf(lowPerformer)
        if (index > -1) {
            lowPerformer.descendants.splice(index, 1);
        }

        // assign boss
        highPerformer.boss = nodeAbove
        lowPerformer.boss = highPerformer

    } else {
        console.log("no further demotions possible")
        // maybe fire them in this scenario?
    }

    console.log(`[demoteEmployee]: Demoted employee (demoted ${lowPerformer} and replaced with ${highPerformer})`);
}
