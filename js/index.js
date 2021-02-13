// const eventStartSelect = document.querySelector(".start-event");
// const eventEndSelect = document.querySelector(".end-event");

// const renderOptionTime = (element, hour, minutes)=>{
//    const optionTime = document.createElement("option")
//    if(hour>12){
//        optionTime.setAttribute('value', hour*60 + minutes );
//        optionTime.innerText= `${hour-12}:${minutes}`;
//     }else{
//         optionTime.setAttribute('value', hour);
//         optionTime.innerText= `${hour}:${minutes}`;
//     }
//     element.appendChild(optionTime);
// };
// for(let i=8; i<=17; i++){
//     if(i<17){
//         for(let j=0; j<=45; j+=15){
//             if(j==0){
//                 renderOptionTime(eventStartSelect, i, '00');
//                 renderOptionTime(eventEndSelect, i, '00');
//             }else{
//                 renderOptionTime(eventStartSelect, i, j);
//                 renderOptionTime(eventEndSelect, i, j);
//             }
//         }
//     }else{
//         renderOptionTime(eventStartSelect, i, '00');
//         renderOptionTime(eventEndSelect, i, '00');
//     }
// }

const calendarEvents = document.querySelector('.plan')

const eventArray = [
    {start: 0, duration: 30, title: "Go to gum"},
    {start: 25, duration: 30, title: "Go to fe"},
    {start: 30, duration: 30, title: "Go to 222"},
    {start: 60, duration: 60, title: "Go to m"},
    {start: 100, duration: 30, title: "asdgadsg"},
    {start: 360, duration: 30, title: "asdfadsf"},
    {start: 370, duration: 30, title: "Gsdfm"},
    {start: 405, duration: 30, title: "Gofokggum"},
];

class Event{
    constructor(){

    }

    addEvent(){

        eventArray.push()
    }

    renderEvents(arr){

    }

    removeEvent(){

    }

    changeEvent(){

    }

}

const renderEvents =(arr)=>{
    arr.forEach((eventData, index, array) => {
        const previousEventData = array[index-1]
        const event = document.createElement('div');
        if(index == 0){
            event.setAttribute('class', 'single-event');
            event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px;`);
        }else{
            if(eventData.start<previousEventData.start + previousEventData.duration){
                event.setAttribute('class', 'double-event');
                event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; left: 50%`);
            }else{
                event.setAttribute('class', 'single-event');
                event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px;`);
            }
        }
        event.innerHTML = ` <p>${eventData.title}</p> `;
        calendarEvents.append(event);
        console.log(previousEventData)
    });
};

renderEvents(eventArray);