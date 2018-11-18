/*
*	特殊的公共处理
*/


function arrayToString(array) {
	array[0] = '\'' + array[0] + '\'';
	return array.reduce((acc, item) => {
			return  acc + "," + '\'' + item + '\'';
			});
}

exports.arrayToString = arrayToString;