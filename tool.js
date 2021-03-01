const moment = require('moment-timezone');

/**
 * 띄어쓰기 다음에 있는 거 반환, 없으면 "" 반환
 * @param {String} str String to check(String).
 * @returns {String}
 */
function getQuery(str) {
    return (str.split(" ").length === 1)? "" : str.slice((str.split(" ")[0] + " ").length);
}


/**
 * 해당 시간 값을 "몇 년, 몇 개월, 몇 일, 몇 시간, 몇 분, 몇 초" 형식으로 반환해줌.
 * @param {Number} snowflake 시각 사이의 시간 값(자연수)
 * @return {String}
 */
function timeAgo(snowflake) {
    moment.locale('ko');
    return moment(snowflake * 1000).fromNow();
}


module.exports.getQuery = getQuery;
module.exports.timeAgo = timeAgo;