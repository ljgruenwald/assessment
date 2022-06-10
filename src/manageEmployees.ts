import { getBoss, getEmployeeByName, getSubordinates } from './getEmployees'

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

export type employeeJson = {
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
export function hireEmployee(tree: TreeNode, newEmployee: employeeJson, bossName: string): void {
    if (newEmployee.name.indexOf("@") !== -1 && newEmployee.name.indexOf(".") !== -1){
        // if we assume email is the only other invalid input type
        // and we assume the first half of email is their name...
        newEmployee = fixName(newEmployee);
    };
    if (bossName !== null){
        var bossNode = getBoss(tree, newEmployee.name, bossName)
    }

    const newEmployeeNode = new TreeNode(
        newEmployee.name, 
        newEmployee.jobTitle,
        bossNode,
        parseInt(newEmployee.salary),
    );

    if (bossNode){
        bossNode.descendants.push(newEmployeeNode);
    }

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
export function fireEmployee(tree: TreeNode, name: string): void {

    // find your employee node to remove 
    const fireMe = getEmployeeByName(tree, name); 

    // if employee has subordinates, promote a random one 
    if (fireMe.descendants.length > 0){
        const toPromote = fireMe.descendants[0]
        const inherited = fireMe.descendants.slice(1);
        fireMe.boss.descendants.push(toPromote);
        toPromote.descendants = toPromote.descendants.concat(inherited);
        toPromote.boss = fireMe.boss;
        const index = fireMe.boss.descendants.indexOf(fireMe);
        if (index > -1) {
            fireMe.boss.descendants.splice(index, 1);
        }
        console.log(`[fireEmployee]: Fired ${fireMe.name} and replaced with ${toPromote.name}`);
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
export function promoteEmployee(tree: TreeNode, employeeName: string): void {
    // first find your employee node to promote
    const promoteMe = getEmployeeByName(tree, employeeName);
    const promotedDescendants = promoteMe.descendants
    const demoteMe = promoteMe.boss
    const demotedDescendants = demoteMe.descendants
    const nodeAbove = demoteMe.boss;
    
    if (nodeAbove){
        nodeAbove.descendants.push(promoteMe);
        var index = nodeAbove.descendants.indexOf(demoteMe)
        if (index > -1) {
            nodeAbove.descendants.splice(index, 1);
        }
    }
    
    promoteMe.descendants = demotedDescendants
    promoteMe.descendants.push(demoteMe)
    index = promoteMe.descendants.indexOf(promoteMe)
    if (index > -1) {
        promoteMe.descendants.splice(index, 1);
    }
    // inform everyone of their new boss
    for (let child of promoteMe.descendants){
        child.boss = promoteMe
    }


    demoteMe.descendants = promotedDescendants
    index = demoteMe.descendants.indexOf(demoteMe)
    if (index > -1) {
        demoteMe.descendants.splice(index, 1);
    }

    // assign boss to promoted employee
    promoteMe.boss = nodeAbove
    demoteMe.boss = promoteMe

    // swap job title
    var tempJob = promoteMe.jobTitle
    promoteMe.jobTitle = demoteMe.jobTitle
    demoteMe.jobTitle = tempJob

    // swap salary
    var tempSalary = promoteMe.salary
    promoteMe.salary = demoteMe.salary
    demoteMe.salary = tempSalary

    console.log(`[promoteEmployee]: Promoted ${promoteMe.name} and made ${demoteMe.name} their subordinate`);
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
export function demoteEmployee(tree: TreeNode, employeeName: string, subordinateName: string): void {
    // similar to promotion, we are swapping two nodes 
    const demoteMe = getEmployeeByName(tree, employeeName);
    const promoteMe = getEmployeeByName(tree, subordinateName);

    // need to have a subordinate available to make it possible to demote
    if (demoteMe.descendants.length){
        
        const promotedDescendants = promoteMe.descendants
        const demotedDescendants = demoteMe.descendants
        if (demoteMe.boss){
            var nodeAbove = demoteMe.boss;
            nodeAbove.descendants.push(promoteMe);
            var index = nodeAbove.descendants.indexOf(demoteMe)
            if (index > -1) {
                nodeAbove.descendants.splice(index, 1);
            }
        }

        promoteMe.descendants = demotedDescendants
        promoteMe.descendants.push(demoteMe)
        index = promoteMe.descendants.indexOf(promoteMe)
        if (index > -1) {
            promoteMe.descendants.splice(index, 1);
        }
        // inform everyone of their new boss
        for (let child of promoteMe.descendants) {
            child.boss = promoteMe
        }


        demoteMe.descendants = promotedDescendants
        index = demoteMe.descendants.indexOf(demoteMe)
        if (index > -1) {
            demoteMe.descendants.splice(index, 1);
        }

        // assign boss
        promoteMe.boss = nodeAbove
        demoteMe.boss = promoteMe

        // swap job title
        var tempJob = promoteMe.jobTitle
        promoteMe.jobTitle = demoteMe.jobTitle
        demoteMe.jobTitle = tempJob

        // swap salary
        var tempSalary = promoteMe.salary
        promoteMe.salary = demoteMe.salary
        demoteMe.salary = tempSalary

    } else {
        console.log("no further demotions possible")
        // maybe fire them in this scenario?
    }

    console.log(`[demoteEmployee]: Demoted employee (demoted ${demoteMe.name} and replaced with ${promoteMe.name})`);
}

let employees = [
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
]

let jebNode = {
    "name": "Jeb",
    "jobTitle": "Florida Governor",
    "boss": "Sarah",
    "salary": "150000"
}

let tree = generateCompanyStructure(employees);
console.log('.')
console.log("--- INITIAL TREE NOW FULLY GENERATED ---")
console.log('.')
hireEmployee(tree, jebNode, "Sarah")
fireEmployee(tree, "Alicia")
promoteEmployee(tree, "Jared")
demoteEmployee(tree, "Xavier", "Maria")

getBoss(tree, "Bill", "Jared")
getSubordinates(tree, "Jeb")


