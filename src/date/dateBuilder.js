const dateBuilder = (data) => {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let date = data.getDate();
    let month = months[data.getMonth()];
    let year = data.getFullYear();

    return `${date} ${month} ${year}`
} 

export default dateBuilder;