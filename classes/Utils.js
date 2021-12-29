class Utils {
    static dateFormat(date){
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}
                ${date.getHours() + 1}:${date.getMinutes()}:${date.getSeconds()}`; 
    }
}