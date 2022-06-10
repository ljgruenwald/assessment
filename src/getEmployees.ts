import { TreeNode, Employee } from './manageEmployees'

// BFS Helper 
export function getEmployeeByName(node: TreeNode, nameWanted: string): TreeNode{
    let queue = [node];
    while (queue.length > 0){
        let current = queue.shift()
        if (current.name === nameWanted){
            return current;
        } else {
            for (let child of current.descendants){
                queue.push(child)
            }
        }
    }
    console.log("employee not found")
}

/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @param {string} bossName
 * @returns {TreeNode}
 */
export function getBoss(tree: TreeNode, employeeName: string, bossName: string): TreeNode {
    let bossNode = getEmployeeByName(tree, bossName);
    if (bossNode){
        console.log(`[getBoss]: ${employeeName}'s boss is ${bossNode.name}`);
    } else {
        console.log(`[getBoss]: ${employeeName} does not have a boss`);
    }
    return bossNode;
}

/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode[]}
 */
export function getSubordinates(tree: TreeNode, employeeName: string): TreeNode[] {
    let employeeNode = getEmployeeByName(tree, employeeName);
    let bossNode = getEmployeeByName(tree, employeeNode.boss.name);
    if (bossNode.descendants.length > 0){
        let filtered = bossNode.descendants.filter((node) => node !== employeeNode)
        let filteredNames = filtered.map((node) => " " + node.name )
        console.log(`[getSubordinate]: ${employeeName}'s subordinates are ${filteredNames}`);
        return employeeNode.descendants
    } else {
        console.log("no subordinates")
        return [];
    }
}

/**
 * EXTRA CREDIT:
 * Finds and returns the lowest-ranking employee and the tree node's depth index.
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
function findLowestEmployee() {

}