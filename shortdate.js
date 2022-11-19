const getShortDate = () => {
    let sDate = new Date();
    const hour = sDate.getHours();
    const min = sDate.getMinutes();
    const sec = sDate.getSeconds();

    const time = hour + ':' + min + ':' + sec;

    const day = sDate.getDate();
    const month = sDate.getMonth();
    const year = sDate.getFullYear();

    return month + '/' + day + '/' + year + 'T' + time;
}

module.exports = { getShortDate }