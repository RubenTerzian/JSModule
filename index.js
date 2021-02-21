const calendarEvents = document.querySelector('.plan');
const modalWindow = document.querySelector('#modal')


const eventDataArray = [
    // {start: 0, duration: 200, title: "Go to gum after hard day"},
    // {start: 60, duration: 60, title: "Go to fe"},
    // {start: 130, duration: 30, title: "Go to 222"},
    // {start: 170, duration: 210, title: "Go to m"},
    // {start: 240, duration: 30, title: "asdgadsg"},
    // {start: 300, duration: 30, title: "asdfadsf"},
    // {start: 370, duration: 100, title: "Gsdfm"},
];

const arrayForRender = [
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
        let id = 1;

        const clearInput = (input)=>{
            input.value = "";
        }
        // Show and hides inputs
        const eventInfo = document.querySelector(".event-info")
        const addEventButton = document.querySelector(".add-event");
        addEventButton.addEventListener('click', event => {
            if (event.target.parentNode.className === 'add-event') {
                event.target.parentNode.className += " active";
                eventInfo.className = "event-info"
            } else {
                clearInput(inpAddTitle);
                clearInput(inpAddStartTime);
                clearInput(inpAddEndTime);
                event.target.parentNode.className = "add-event";
                eventInfo.className = "event-info disabled"
            }
        });

        const btnCreateEvent = document.querySelector('#btn-add-event');
        const inpAddTitle = document.querySelector('#input-add-title');
        const inpAddStartTime = document.querySelector('#input-add-start-time');
        const inpAddEndTime = document.querySelector('#input-add-end-time');
        const inpSetColor = document.querySelector('#input-set-color');


        btnCreateEvent.addEventListener('click', () => {
            const eventData = {}
            const eventDataForRender = {}

            const validStartTime = (elem)=> {
                let timeArr = elem.split(':');
                return +timeArr[0]*60+(+timeArr[1])
            }
            eventData.start = validStartTime(inpAddStartTime.value)-8*60
            eventData.duration = validStartTime(inpAddEndTime.value)-8*60 - eventData.start
            eventData.title = inpAddTitle.value;
            Object.assign(eventDataForRender, eventData);
            eventDataForRender.color = inpSetColor.value;
            eventDataForRender.startTime = inpAddStartTime.value;
            eventDataForRender.endTime = inpAddEndTime.value;
            
            if (inpAddStartTime.value < inpAddStartTime.min 
                || inpAddStartTime.value > inpAddStartTime.max 
                || inpAddEndTime.value < inpAddEndTime.min 
                || inpAddEndTime.value > inpAddEndTime.max) {
                alert("Your event should start no earlier than 8 am and end no later than 5 pm")
            } else {
                if (inpAddStartTime.value >= inpAddEndTime.value) {
                    alert("The end time must be greater than the start time of the event")
                } else {
                    const currentEventsArray = arrayForRender.filter(el => 
                        el.start <= eventData.start+eventData.duration && el.start+el.duration >= eventData.start
                    )
                    clearInput(inpAddTitle);
                    clearInput(inpAddStartTime);
                    clearInput(inpAddEndTime);
                    if (currentEventsArray.length > 1) {
                        alert('Only 2 events at the same time')
                    } else {
                        eventDataForRender.id = id++;
                        eventDataArray.push(eventData)
                        arrayForRender.push(eventDataForRender)
                        arrayForRender.sort((a,b)=>a.start-b.start)
                        this.renderEvents();
                    }
                }
            }
        })

        
    }

    modal(eventForRender, event) {
        event.addEventListener('click', e => {

        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
            
            <div>
                <h3>Name of event</h3>
                <input type="text" name="title" placeholder="Введите имя события..." id="modal-input-add-title" value="${eventForRender.title}">
            </div>
            <div>
                <h3>Start</h3>
                <input type="time" min="08:00" max="17:00" id="modal-input-add-start-time" value="${eventForRender.startTime}">
            </div>
            <div>
                <h3>End</h3>
                <input type="time" min="08:00" max="17:00" id="modal-input-add-end-time" value="${eventForRender.endTime}">
            </div>
            <div class="modal-color">
                <h3>Choose a color</h3>
                <input type="color" id="modal-input-set-color" value="${eventForRender.color}">
            </div>
            <button id="btn-change-event">Save</button>
            <div class="delete-wraper">
                <img src="img/delete.png" alt="image" class="delete-btn">
            </div>
        `
        modalWindow.append(modalContent)

            modalWindow.className = 'modal';
            modalContent.className = "modal-content";
            const deleteBtn = document.querySelector(".delete-btn");
            modalWindow.addEventListener('click', event => {
                if(event.target.className === 'modal'){
                    event.target.innerText='';
                    event.target.className += " disabled";
                };
            })
            this.removeEvent(deleteBtn, eventForRender, event)
            this.changeEvent(eventForRender, event)
        })
    
    }

    renderEvents() {
        let previousEvent = ""
        calendarEvents.innerHTML = '';
        arrayForRender.forEach((eventData, index, array) => {
            const event = document.createElement('div');
                
            // Если это первый элемент
            if (index == 0) {
                // Если следующие событие начинается, пока предыдущее длиться
                if (array.length>1 && eventData.start + eventData.duration > array[index+1].start) {
                    event.setAttribute('class', 'double-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; background-color:${eventData.color+"70"}; border-left: 3px solid ${eventData.color}`);
                } else {
                    event.setAttribute('class', 'single-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; background-color:${eventData.color+"70"}; border-left: 3px solid ${eventData.color}`);
                }
                previousEvent = event;
            } else {

                let previousEventEndTime = previousEvent.offsetTop / 2 + previousEvent.offsetHeight / 2;
            
                if (eventData.start < previousEventEndTime ||  index<array.length-1 && eventData.start + eventData.duration > array[index+1].start) {
                    event.setAttribute('class', 'double-event');
                    if (previousEvent.offsetLeft == 0) {
                        event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; left: 50%; background-color:${eventData.color+"70"}; border-left: 3px solid ${eventData.color}`);
                    } else {
                        event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; background-color:${eventData.color+"70"}; border-left: 3px solid ${eventData.color}`);
                    }
                }else{
                    event.setAttribute('class', 'single-event');
                    event.setAttribute('style', `top: ${eventData.start*2}px; height: ${eventData.duration*2}px; background-color:${eventData.color+"70"}; border-left: 3px solid ${eventData.color}`);
                }

                // Если предыдущее событие уже закончилось, когда началось текущее; или конец текущего событие позже чем конец предыдущего события
                if (previousEventEndTime < eventData.start || eventData.start + eventData.duration > previousEventEndTime) {
                    previousEvent = event;
                }

            }
            event.innerHTML = ` <p>${eventData.title}</p> `;
            event.id = eventData.id
            calendarEvents.append(event);
            this.modal(eventData, event)
        });

    }

    removeEvent(btn, eventForRender, event) {
        btn.addEventListener('click', e => {
            const removedEventFromArrayForRenderIndex = arrayForRender.indexOf(eventForRender);
            arrayForRender.splice(removedEventFromArrayForRenderIndex, 1)
            const removedEventFromEventDataArray = eventDataArray.find(data => data.start == eventForRender.start && data.duration == eventForRender.duration && data.title == eventForRender.title)
            const removedEventFromEventDataArrayIndex = eventDataArray.indexOf(removedEventFromEventDataArray);
            eventDataArray.splice(removedEventFromEventDataArrayIndex, 1)
            modalWindow.innerText='';
            modalWindow.className += " disabled";
            this.renderEvents()
            this.modal(eventForRender, event)
        })
            
    }

    changeEvent(eventForRender, event){
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

            const changingEvent = eventDataArray.find(data => 
                data.start == eventForRender.start 
                && data.duration == eventForRender.duration 
                && data.title == eventForRender.title)

            if (inpAddStartTime.value < inpAddStartTime.min 
                || inpAddStartTime.value > inpAddStartTime.max 
                || inpAddEndTime.value < inpAddEndTime.min 
                || inpAddEndTime.value > inpAddEndTime.max) {
                alert("Your event should start no earlier than 8 am and end no later than 5 pm")
            } else {
                if (inpAddStartTime.value >= inpAddEndTime.value) {
                    alert("The end time must be greater than the start time of the event")
                } else {
                    eventForRender.start = validStartTime(inpAddStartTime.value)-8*60
                    eventForRender.duration = validStartTime(inpAddEndTime.value)-8*60 - eventForRender.start
                    eventForRender.title = inpAddTitle.value;
                    eventForRender.color = inpSetColor.value;
                    changingEvent.start = validStartTime(inpAddStartTime.value)-8*60
                    changingEvent.duration = validStartTime(inpAddEndTime.value)-8*60 - eventForRender.start
                    changingEvent.title = inpAddTitle.value;
                        arrayForRender.sort((a,b)=>a.start-b.start)
                        this.renderEvents()
                        this.modal(eventForRender, event);
                        
                        modalWindow.innerText='';
                        modalWindow.className += " disabled";
                }
            }
        })
    }

}

const calendar = new Calendar();
calendar.addEvent();

