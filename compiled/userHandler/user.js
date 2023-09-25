"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoints = exports.setUser = exports.subtractFromUser = exports.addToUser = exports.pointTypes = void 0;
const users = require('../users.json');
var pointTypes;
(function (pointTypes) {
    pointTypes["SCORE"] = "score";
    pointTypes["POINTS"] = "points";
})(pointTypes || (exports.pointTypes = pointTypes = {}));
function addToUser(userid, pnts, amount) {
    //add the points
    if (!users[userid]) {
        createEmptyUser(userid);
    }
    if (pnts === pointTypes.POINTS) {
        users[userid].points += amount;
    }
    else if (pnts === pointTypes.SCORE) {
        users[userid].score += amount;
    }
    else {
        console.log('something went wrong');
        return false;
    }
    require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4));
    return true;
}
exports.addToUser = addToUser;
function subtractFromUser(userid, pnts, amount) {
    //subtract the points
    if (!users[userid]) {
        createEmptyUser(userid);
    }
    if (pnts === pointTypes.POINTS) {
        users[userid].points -= Math.abs(amount);
    }
    else if (pnts === pointTypes.SCORE) {
        users[userid].score -= Math.abs(amount);
    }
    else {
        console.log('something went wrong');
        return false;
    }
    require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4));
    return true;
}
exports.subtractFromUser = subtractFromUser;
function setUser(userid, pnts, amount) {
    //set the points
    if (!users[userid]) {
        createEmptyUser(userid);
    }
    if (pnts === pointTypes.POINTS) {
        users[userid].points = amount;
    }
    else if (pnts === pointTypes.SCORE) {
        users[userid].score = amount;
    }
    else {
        console.log('something went wrong');
        return false;
    }
    require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4));
    return true;
}
exports.setUser = setUser;
function getPoints(userid, pnts) {
    if (!users[userid]) {
        createEmptyUser(userid);
    }
    if (pnts === pointTypes.POINTS) {
        return users[userid].points;
    }
    else if (pnts === pointTypes.SCORE) {
        return users[userid].score;
    }
    else {
        console.log('something went wrong');
        return false;
    }
}
exports.getPoints = getPoints;
function createEmptyUser(userid) {
    users[userid] = {
        points: 0,
        score: 0
    };
    require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4));
    return true;
}
