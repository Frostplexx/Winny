const users = require('../users.json')

export interface User {
	points: number
	score: number
}

export enum pointTypes {
	SCORE = 'score',
	POINTS = 'points'
}

export function addToUser(userid: string, pnts: pointTypes.POINTS | pointTypes.SCORE, amount: number){
	//add the points
	if (!users[userid]) {
		createEmptyUser(userid)
	}
	if(pnts === pointTypes.POINTS){
		users[userid].points += amount;
	} else if(pnts === pointTypes.SCORE){
		users[userid].score += amount;
	}  else {
		console.log('something went wrong')
		return false;
	}
	require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4))
	return true;
}



export function subtractFromUser(userid: string, pnts: pointTypes.POINTS | pointTypes.SCORE, amount: number){
	//subtract the points
	if (!users[userid]) {
		createEmptyUser(userid)
	}
	if(pnts === pointTypes.POINTS){
		users[userid].points-= Math.abs(amount);
	} else if(pnts === pointTypes.SCORE){
		users[userid].score -= Math.abs(amount);
	}  else {
		console.log('something went wrong')
		return false;
	}
	require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4))
	return true;
}

export function setUser(userid: string, pnts: pointTypes.POINTS | pointTypes.SCORE, amount: number){
	//set the points
	if (!users[userid]) {
		createEmptyUser(userid)
	}
	if(pnts === pointTypes.POINTS){
		users[userid].points = amount
	} else if(pnts === pointTypes.SCORE){
		users[userid].score = amount
	}  else {
		console.log('something went wrong')
		return false;
	}
	require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4))
	return true;
}

export function getPoints(userid: string, pnts: pointTypes.POINTS | pointTypes.SCORE){
	if (!users[userid]) {
		createEmptyUser(userid)
	}
	if(pnts === pointTypes.POINTS){
		return users[userid].points
	} else if(pnts === pointTypes.SCORE){
		return users[userid].score
	}  else {
		console.log('something went wrong')
		return false;
	}
}


function createEmptyUser(userid: string){
	users[userid] = {
		points: 0,
		score: 0
	}
	require('fs').writeFileSync('./src/users.json', JSON.stringify(users, null, 4))
	return true;
}
