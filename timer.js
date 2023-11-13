

document.addEventListener("DOMContentLoaded", function () {
    const startTimerButtons = document.querySelectorAll('.start-button');
    const dateInputs = document.querySelectorAll('.date-input');
    const timezoneSelects = document.querySelectorAll('.timezone-input');
    const timerContainers = document.querySelectorAll('.timer-container');
    const video = document.querySelector('#background-video');


    let timers = [];
    video.pause();

    startTimerButtons.forEach((button, index) => {
        button.addEventListener('click', () => startCountdown(index));
    });

    function startCountdown(index) {
        const rawTargetDate = dateInputs[index].value;
        const timezone = timezoneSelects[index].value;
        const timerContainer = timerContainers[index];

        // Get the selected alarm sound file
        const alarmSoundInput = document.getElementById('alarm-sound-input');
        const selectedAlarmSoundFile = alarmSoundInput.files[0]; // Assuming you want only one file



       
    

        
    

        const targetDateInTimezone = moment.tz(rawTargetDate, timezone);

        // Start the timer with the alarm sound
        const newTimer = new CountdownTimer(targetDateInTimezone, timerContainer,    selectedAlarmSoundFile);
        timers.push(newTimer);

        // Play the video when the timer starts
        video.play();

        // Set up an event listener to pause the video when the timer stops
        timerContainer.addEventListener('stop', () => {
            video.pause();
        });
    }
});




class CountdownTimer {
    constructor(targetDate, timerContainer, alarmSoundFilePath) {
        this.targetDate = targetDate;
        this.timerContainer = timerContainer;
        this.alarmSoundFilePath = alarmSoundFilePath;
        this.countdownInterval = setInterval(() => this.updateTimer(), 1000);
        this.audio = new Audio();
    }

    updateTimer() {
        const now = moment();
        const timeDifference = this.targetDate.diff(now);

        if (timeDifference <= 0) {
            clearInterval(this.countdownInterval);
            this.timerContainer.textContent = 'Timer Expired!';
            // Trigger 'stop' event when the timer ends
            const stopEvent = new Event('stop');
            this.timerContainer.dispatchEvent(stopEvent);

            // Play the alarm sound when the timer stops
            this.playAlarmSound();
        } else {
            const { days, hours, minutes, seconds } = this.calculateTimeUnits(timeDifference);
            this.timerContainer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    calculateTimeUnits(timeDifference) {
        const duration = moment.duration(timeDifference);
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        return { days, hours, minutes, seconds };
    }
    playAlarmSound() {
        if (this.alarmSoundFilePath) {
            // Check if it's a Blob or File
            if (this.alarmSoundFilePath instanceof Blob || this.alarmSoundFilePath instanceof File) {
                // Create a Blob URL for the audio source
                this.audio.src = URL.createObjectURL(this.alarmSoundFilePath);
    
                // Delay the play action to ensure proper loading
                setTimeout(() => {
                    this.audio.play();
                }, 4000);
            } else {
                console.error("Invalid alarm sound file format");
            }
        }
    }
    
    
    
    
}
