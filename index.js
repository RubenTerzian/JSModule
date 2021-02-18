const calendarEvents = document.querySelector('.plan');
const modalWindow = document.querySelector('#modal')


const eventArray = [
    // {start: 0, duration: 200, title: "Go to gum after hard day"},
    // {start: 60, duration: 60, title: "Go to fe"},
    // {start: 130, duration: 30, title: "Go to 222"},
    // {start: 170, duration: 210, title: "Go to m"},
    // {start: 240, duration: 30, title: "asdgadsg"},
    // {start: 300, duration: 30, title: "asdfadsf"},
    // {start: 370, duration: 100, title: "Gsdfm"},
];

class Calendar{

    addEvent() {
        // Show and hides inputs
        const eventInfo = document.querySelector(".event-info")
        const addEventButton = document.querySelector(".add-event");
        addEventButton.addEventListener('click', event => {
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
        const inpSetColor = document.querySelector('#input-set-color');


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
                    // ТУТ НАДО ДОПИЛИТЬ ЛОГИКУ
                    if (currentEventsArray.length > 1) {
                        alert('to many')
                    } else {
                        eventArray.push(eventData)
                        eventArray.sort((a,b)=>a.start-b.start)
                        this.renderEvents(inpSetColor.value, eventData);
                        this.modal(inpSetColor.value, eventData);
                    }
                }
            }
        })

        
    }

    modal(eventColor, eventData) {
        const eventsArray = document.querySelectorAll(".single-event, .double-event")
        console.log(eventData)
        let validStartTime =''
        let validEndTime =''
        eventData? validStartTime = ((Math.floor((eventData.start + 8 * 60) / 60))>9 ? Math.floor((eventData.start + 8 * 60) / 60): "0"+(Math.floor((eventData.start + 8 * 60) / 60))) + ":" + (((eventData.start + 8 * 60) % 60 == 0) ? "00":(eventData.start + 8 * 60) % 60):'';
        eventData? validEndTime = ((Math.floor((eventData.start +eventData.duration + 8 * 60) / 60))>9 ? Math.floor((eventData.start + eventData.duration + 8 * 60) / 60): "0"+(Math.floor((eventData.start + eventData.duration + 8 * 60) / 60))) + ":" + (((eventData.start+eventData.duration + 8 * 60) % 60 == 0) ? "00":(eventData.start+eventData.duration + 8 * 60) % 60):'';
        eventsArray.forEach(element => {
            element.addEventListener('click', e => {
                modalWindow.className = 'modal'
                const modalContent = document.createElement('div')
                modalContent.className = "modal-content"
                modalContent.innerHTML = `
                    
                    <div>
                        <h3>Name of event</h3>
                        <input type="text" name="title" placeholder="Введите имя события..." id="modal-input-add-title" value="${eventData?eventData.title:''}">
                    </div>
                    <div>
                        <h3>Start</h3>
                        <input type="time" min="08:00" max="17:00" id="modal-input-add-start-time" value="${validStartTime}">
                    </div>
                    <div>
                        <h3>End</h3>
                        <input type="time" min="08:00" max="17:00" id="modal-input-add-end-time" value="${validEndTime}">
                    </div>
                    <div class="modal-color">
                        <h3>Choose a color</h3>
                        <input type="color" id="modal-input-set-color" value="#6E9ECF">
                    </div>
                    <button id="btn-change-event">Add event</button>
                    <div class="delete-wraper">
                        <img src="img/delete.png" alt="image" class="delete-btn">
                    </div>
                `
                modalWindow.append(modalContent)
                const deleteBtn = document.querySelector(".delete-btn");
                modalWindow.addEventListener('click', event => {
                    if(event.target.className === 'modal'){
                        event.target.innerText='';
                        event.target.className += " disabled";
                    };
                })
                this.removeEvent(deleteBtn, element, eventColor, eventData)
                this.changeEvent(eventData, eventData)
            })
        })
        
    }

    renderEvents(eventColor, elem) {
        let previousEvent = ""
        calendarEvents.innerHTML = '';
        const currnetEvent = elem;
        eventArray.forEach((eventData, index, array) => {
            const event = document.createElement('div');
                
            // Если это первый элемент
            if (index == 0) {
                // Если следующие событие начинается, пока предыдущее длиться
                if (array.length>1 && eventData.start + eventData.duration > array[index+1].start) {
                    event.setAttribute('class', 'double-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; `);
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
                        event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; left: 50%;`);
                    } else {
                        event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; `);
                    }
                }else{
                    event.setAttribute('class', 'single-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; `);
                }

                // Если предыдущее событие уже закончилось, когда началось текущее; или конец текущего событие позже чем конец предыдущего события
                if (previousEventEndTime < eventData.start || eventData.start + eventData.duration > previousEventEndTime) {
                    previousEvent = event;
                }

            }
            if(currnetEvent == eventData){
                event.style.backgroundColor = eventColor+"70";
                event.style.borderLeft = `3px solid ${eventColor}`;
            }
            event.innerHTML = ` <p>${eventData.title}</p> `;
            calendarEvents.append(event);
            
        });

    }

    removeEvent(btn, elem, eventColor, eventData) {
        btn.addEventListener('click', e => {
            const removedEventIndex = eventArray.indexOf(elem);
            eventArray.splice(removedEventIndex, 1)
            modalWindow.innerText='';
            modalWindow.className += " disabled";
            this.renderEvents(eventColor,  elem)
            this.modal(eventColor, eventData)
        })
            
    }

    changeEvent(elem, eventData){
        const btnChangeEvent = document.querySelector('#btn-change-event');
        const validStartTime = (elem)=> {
            let timeArr = elem.split(':');
            return +timeArr[0]*60+(+timeArr[1])
        }
        btnChangeEvent.addEventListener('click', e=>{
            const inpAddTitle = document.querySelector('#modal-input-add-title');
            const inpAddStartTime = document.querySelector('#modal-input-add-start-time');
            const inpAddEndTime = document.querySelector('#modal-input-add-end-time');
            const inpSetColor = document.querySelector('#modal-input-set-color');
            elem.start = validStartTime(inpAddStartTime.value)-8*60
            elem.duration = validStartTime(inpAddEndTime.value)-8*60 - eventData.start
            elem.title = inpAddTitle.value

            if (inpAddStartTime.value < inpAddStartTime.min || inpAddStartTime.value > inpAddStartTime.max || inpAddEndTime.value < inpAddEndTime.min || inpAddEndTime.value > inpAddEndTime.max) {
                alert("Your event should start no earlier than 8 am and end no later than 5 pm")
            } else {
                if (inpAddStartTime.value >= inpAddEndTime.value) {
                    alert("The end time must be greater than the start time of the event")
                } else {
                        eventArray.sort((a,b)=>a.start-b.start)
                        this.renderEvents(inpSetColor.value, elem)
                        this.modal(inpSetColor.value, eventData);
                }
            }
            
            // this.modal(eventColor, eventData)
            modalWindow.innerText='';
            modalWindow.className += " disabled";
        })
    }

}

const calendar = new Calendar();
calendar.renderEvents();
calendar.modal();
calendar.addEvent();

