/*
*	特殊的公共处理
*/


function arrayToString(array) {
	return array.reduce((acc, item) => {
			return  acc + "," + '\'' + item + '\'';
			}, '\'' + array[0] + '\'');
}

exports.arrayToString = arrayToString;