class TreeNode {
    name: string;
    jobTitle: string;
    boss: TreeNode;
    salary: number;
    descendants: TreeNode[];
    constructor(name = null, jobTitle = null, boss = null, salary = null) {
        this.name = name;
        this.jobTitle = jobTitle;
        this.boss = boss;
        this.salary = salary;
        this.descendants = [];
    }
}

/**
 * Normalizes the provided JSON file and generates a tree of employees.
 *
 * @param {Object[]} employees array of employees
 * @returns {TreeNode}
 */
function generateCompanyStructure(employees: Object[]): TreeNode {
    // hire everyone using the array of employee objects

    // find the ceo and start the tree with them
    const ceo = employees.find((employee: object) => employee.jobTitle === "CEO");
    const root = new TreeNode(ceo.name, ceo.jobTitle, null, parseInt(ceo.salary));

    console.log("Generating employee tree...");

    // hire the plebs
    employees.slice(1).forEach((pleb: Object) => {
        hireEmployee(root, pleb, pleb.boss.name)
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
function hireEmployee(tree: TreeNode, newEmployee: Object, bossName: string): void {
    if (newEmployee.name.includes("@")){
        // this makes assumptions, but it works for given input
        newEmployee = fixName(newEmployee);
    };

    const bossNode = null//  !! Add function here to find the boss node !!

    const newEmployeeNode = new TreeNode(
        newEmployee.name, 
        newEmployee.jobTitle,
        newEmployee.boss,
        parseInt(newEmployee.salary),
    );

    // if they have a boss, add them to descendants 
    bossNode.descendants.push(newEmployeeNode);

    console.log(`[hireEmployee]: Added new employee (${newEmployee.name}) 
    with ${bossName} as their boss`);
}

function fixName(newEmployee: Object): Object{
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
    // const slacker = findEmployeeNode() 

    // if employee has subordinates, promote a random one while firing slacker
    // else just remove the employee 

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
    // const highPerformer = findEmployeeNode()

    // find their boss to demote 
    // const lowPerformer = highPerformer.boss

    // swap them and console.log it
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
    // find your employee to demote
    // const lowPerformer = findEmployeeNode()
    // find your subordinate to promote
    // const highPerformer = findEmployeeNode()

    // swap the two nodes and console.log it 
}
