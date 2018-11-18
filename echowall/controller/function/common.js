/*
*	特殊的公共处理
*/


function arrayToString(array) {
	return array.reduce((acc, item) => {
			return  acc + "," + '\'' + item + '\'';
			});
}

exports.arrayToString = arrayToString;