export default function convertDateTime(time) {
    let dates = new Date(time).getUTCFullYear() + '-' +
    ('00' + (time.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + time.getUTCDate()).slice(-2) + ' ' + 
    ('00').slice(-2) + ':' + 
    ('00').slice(-2) + ':' + 
    ('00').slice(-2);
    return dates;
}
