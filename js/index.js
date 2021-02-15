const calendarEvents = document.querySelector('.plan');
const modalWindow = document.querySelector('#modal')


const eventArray = [
    {start: 0, duration: 200, title: "Go to gum after hard day"},
    {start: 60, duration: 60, title: "Go to fe"},
    {start: 130, duration: 30, title: "Go to 222"},
    {start: 170, duration: 210, title: "Go to m"},
    {start: 240, duration: 30, title: "asdgadsg"},
    {start: 300, duration: 30, title: "asdfadsf"},
    {start: 370, duration: 100, title: "Gsdfm"},
];

class Calendar{

    addEvent() {
        // Show and hides inputs
        const eventInfo = document.querySelector(".event-info")
        const addEventButton = document.querySelector(".add-event");
        addEventButton.addEventListener('click', event => {
            event.stopPropagation()
            if (event.target.parentNode.className === 'add-event') {
                event.target.parentNode.className += " active";
                eventInfo.className = "event-info"
            } else {
                event.target.parentNode.className = "add-event";
                eventInfo.className = "event-info disabled"
            }
        });

        const btnCreateEvent = document.querySelector('#btn-add-event');
        const inpAddTitle = document.querySelector('#input-add-title');
        const inpAddStartTime = document.querySelector('#input-add-start-time');
        const inpAddEndTime = document.querySelector('#input-add-end-time');

        btnCreateEvent.addEventListener('click', e => {
            const eventData = {start: '', duration: '', title: ''}

            const validStartTime = (elem)=> {
                let timeArr = elem.split(':');
                return +timeArr[0]*60+(+timeArr[1])
            }
            eventData.start = validStartTime(inpAddStartTime.value)-8*60
            eventData.duration = validStartTime(inpAddEndTime.value)-8*60 - eventData.start
            eventData.title = inpAddTitle.value
            
            if (inpAddStartTime.value < inpAddStartTime.min || inpAddStartTime.value > inpAddStartTime.max || inpAddEndTime.value < inpAddEndTime.min || inpAddEndTime.value > inpAddEndTime.max) {
                alert("Your event should start no earlier than 8 am and end no later than 5 pm")
            } else {
                if (inpAddStartTime.value >= inpAddEndTime.value) {
                    alert("The end time must be greater than the start time of the event")
                } else {
                    const currentEventsArray = eventArray.filter(el => 
                        el.start <= eventData.start+eventData.duration && el.start+el.duration >= eventData.start
                    )
                    console.log(currentEventsArray)
                    if (currentEventsArray.length > 1) {
                        alert('to many')
                    } else {
                        eventArray.push(eventData)
                        eventArray.sort((a,b)=>a.start-b.start)
                        this.renderEvents();
                        this.modal();
                    }
                }
            }
        })

        
    }

    modal() {
        const eventsArray = document.querySelectorAll(".single-event, .double-event")
        eventsArray.forEach(element => {
            element.addEventListener('click', e => {
                modalWindow.className = 'modal'
                const modalContent = document.createElement('div')
                modalContent.className = "modal-content"
                modalContent.innerHTML = `
                    <h3>Name of event</h3>
                    <input type="text" name="title" value="">
                    <h3>Start</h3>
                    <input type="time" min="08:00" max="17:00" value="">
                    <h3>End</h3>
                    <input type="time" min="08:00" max="17:00" value="">
                    <button type="submit">Save</button>
                    <div class="delete-wraper">
                        <img src="img/delete.png" alt="image" class="delete-btn">
                    </div>
                `
                modalWindow.append(modalContent)
                const deleteBtn = document.querySelector(".delete-btn");
                this.removeEvent(deleteBtn, element)
            })
        })
        
    }

    renderEvents() {
        let previousEvent = ""
        calendarEvents.innerHTML = '';
        eventArray.forEach((eventData, index, array) => {
            const validTime = Math.floor((eventData.start + 8 * 60) / 60) + ":" + (((eventData.start + 8 * 60) % 60 == 0) ? "00":(eventData.start + 8 * 60) % 60);
            const event = document.createElement('div');
                
            // Если это первый элемент
            if (index == 0) {
                // Если следующие событие начинается, пока предыдущее длиться
                if (array.length>1 && eventData.start + eventData.duration > array[index+1].start) {
                    event.setAttribute('class', 'double-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px;`);
                } else {
                    event.setAttribute('class', 'single-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px;`);
                }
                previousEvent = event;
            } else {

                let previousEventEndTime = previousEvent.offsetTop / 2 + previousEvent.offsetHeight / 2;
            
                if (eventData.start < previousEventEndTime ||  index<array.length-1 && eventData.start + eventData.duration > array[index+1].start) {
                    event.setAttribute('class', 'double-event');
                    if (previousEvent.offsetLeft == 0) {
                        event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; left: 50%`);
                    } else {
                        event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px;`);
                    }
                }else{
                    event.setAttribute('class', 'single-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px;`);
                }

                // Если предыдущее событие уже закончилось, когда началось текущее; или конец текущего событие позже чем конец предыдущего события
                if (previousEventEndTime < eventData.start || eventData.start + eventData.duration > previousEventEndTime) {
                    previousEvent = event;
                }
            }
            event.innerHTML = ` <p>${eventData.title}</p> `;
            calendarEvents.append(event);
        });

    }

    removeEvent(btn, elem) {
        btn.addEventListener('click', e => {
            const removedEvent = eventArray.filter(el=> el.duration == elem.offsetHeight / 2 && el.start == elem.offsetTop / 2 && el.title == elem.firstElementChild.innerText)
            const removedEventIndex = eventArray.indexOf(removedEvent[0]);
            eventArray.splice(removedEventIndex, 1)
            modalWindow.addEventListener('click', event => {
                    if(event.target.className === 'modal'){
                    event.target.innerText='';
                    event.target.className += " disabled";
                };
            
            })
            modalWindow.innerText='';
            modalWindow.className += " disabled";
            this.renderEvents()
            this.modal()
        })
            
    }

    changeEvent(){


        this.renderEvents()
    }

}

const calendar = new Calendar();
calendar.renderEvents();
calendar.modal();
calendar.addEvent();

