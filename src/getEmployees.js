"use strict";
exports.__esModule = true;
exports.getSubordinates = exports.getBoss = exports.getEmployeeByName = void 0;
// BFS Helper 
function getEmployeeByName(node, nameWanted) {
    var queue = [node];
    while (queue.length > 0) {
        var current = queue.shift();
        if (current.name === nameWanted) {
            return current;
        }
        else {
            for (var _i = 0, _a = current.descendants; _i < _a.length; _i++) {
                var child = _a[_i];
                queue.push(child);
            }
        }
    }
    console.log("employee not found");
}
exports.getEmployeeByName = getEmployeeByName;
/**
 * Given an employee, will find the node above (if any).
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @param {string} bossName
 * @returns {TreeNode}
 */
function getBoss(tree, employeeName, bossName) {
    var bossNode = getEmployeeByName(tree, bossName);
    if (bossNode) {
        console.log("[getBoss]: ".concat(employeeName, "'s boss is ").concat(bossNode.name));
    }
    else {
        console.log("[getBoss]: ".concat(employeeName, " does not have a boss"));
    }
    return bossNode;
}
exports.getBoss = getBoss;
/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode[]}
 */
function getSubordinates(tree, employeeName) {
    var employeeNode = getEmployeeByName(tree, employeeName);
    var bossNode = getEmployeeByName(tree, employeeNode.boss.name);
    if (bossNode.descendants.length > 0) {
        var filtered = bossNode.descendants.filter(function (node) { return node !== employeeNode; });
        var filteredNames = filtered.map(function (node) { return " " + node.name; });
        console.log("[getSubordinate]: ".concat(employeeName, "'s subordinates are ").concat(filteredNames));
        return employeeNode.descendants;
    }
    else {
        console.log("no subordinates");
        return [];
    }
}
exports.getSubordinates = getSubordinates;
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
