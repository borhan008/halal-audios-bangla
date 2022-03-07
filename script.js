const audioCategoryLists = document.getElementById('audio-categories');
const allAudioContainer = document.getElementById('all-audio');

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('previous-btn');
const audioVolume = document.getElementById('audio-volume');
const aduioProgress = document.getElementById('audio-progress');
const audioList = document.getElementById('audio-lists');
audio.volume = 0.1;


allAudioContainer.style.display = "none";

fetch('audio-lists.json')
    .then(res => res.json())
    .then(categoryLists => showCategory(categoryLists));

const showCategory = (categoryListsData) => {
    categoryListsData.map(singleCategory => {
        const createNewCat = document.createElement('div');
        createNewCat.innerHTML = `<div
            class="border border-red-200 py-2 px-5 text-center float-left cursor-pointer rounded-pill rounded-full hover:bg-red-200 audio-category" data-category=${singleCategory.id} >
           ${singleCategory.name}
        </div>`;
        audioCategoryLists.appendChild(createNewCat);

    });
}
audioCategoryLists.addEventListener('click', function (event) {
    if (event.target.classList.contains('audio-category')) {
        newAudioCategoryFull(event.target.getAttribute('data-category'));

    }
});



const changeVolume = (event) => {
    const volume = event.offsetX / audioVolume.clientWidth;
    audio.volume = volume;
    document.querySelector(`#${audioVolume.getAttribute('id')} div`).style.width = `${event.offsetX}px`;

}
document.getElementById('back-categories').addEventListener('click', function () {
    location.href = "index.html";
});

const newAudioCategoryFull = (catId) => {
    audioCategoryLists.style.display = "none";
    document.getElementById('all-audio').style.display = "block";




    //console.log(audio.currentTime);
    fetch(`${catId}.json`)
        .then(res => res.json())
        .then(data => addSongs(data));

    const addSongs = (data) => {
        if (data.length <= 0) {

        } else {

            const totalAudio = data.length;
            let currentAudio = 0;

            const showingAllAudio = () => {
                data.map(singleAudio => {
                    const createNewAudioDiv = document.createElement('div');
                    createNewAudioDiv.innerHTML = `            
                    <div class="border-b border-gray-50 w-full flex p-2 hover:bg-red-200 cursor-pointer items-center single-audio"
                data-id=${singleAudio.id - 1}>
                <img src="${singleAudio.imgUrl ? singleAudio.imgUrl : `def.png`}" alt="" class="rounded">
                <h2 class="text-xl ml-5">${singleAudio.title}</h2>
            </div>`;

                    document.getElementById('audio-lists').appendChild(createNewAudioDiv);
                })
            }
            showingAllAudio();
            const audioDetailsUpadate = (audioData, autoPlay) => {
                audio.currentTime = 0;
                audio.src = data[audioData].url;
                currentAudio = parseInt(audioData);
                if (autoPlay == true) {
                    audio.play();
                    playBtn.innerText = "Pause";
                }
                document.getElementById('audio-name').innerText = data[audioData].title;
                document.getElementById('audio-image').src = data[audioData].imgUrl.length > 0 ? data[audioData].imgUrl : `def.png`;
                document.getElementById('download-link').setAttribute('href', `${data[audioData].url}`);
                const removeClass = document.querySelectorAll(`.single-audio`);
                removeClass.forEach(clName => {
                    clName.classList.remove('bg-red-200');
                })
                document.querySelector(`[data-id="${data[audioData].id - 1}"]`).classList.add('bg-red-200');
            }


            const playMusic = () => {
                if (audio.duration > 0 && !audio.paused) {
                    audio.pause();
                    playBtn.innerText = "Play";
                } else {

                    audio.play();
                    playBtn.innerText = "Pause";
                }
            }

            const changeTime = (e) => {
                const audioTimePercentage = e.srcElement.currentTime / e.srcElement.duration * 100;
                aduioProgress.style.width = `${audioTimePercentage}%`;
            }

            const updateAudioProgress = (e) => {
                if (audio.duration > 0) {
                    const audioUpdateTime = (e.offsetX / aduioProgress.parentNode.clientWidth) * audio.duration;
                    audio.currentTime = audioUpdateTime;
                }
            }


            const nextPrevAudio = (operation) => {
                if (operation < 0) {
                    currentAudio = totalAudio - 1;
                    audioDetailsUpadate(currentAudio, true);
                } else if (operation >= totalAudio) {
                    currentAudio = 0;
                    audioDetailsUpadate(0, true);
                } else {
                    currentAudio = operation;
                    audioDetailsUpadate(operation, true);
                }
            }


            playBtn.addEventListener('click', function () { playMusic(); });
            audio.addEventListener('timeupdate', changeTime);
            aduioProgress.parentNode.addEventListener('click', updateAudioProgress);
            nextBtn.addEventListener('click', function () { nextPrevAudio(currentAudio + 1) });
            prevBtn.addEventListener('click', function () { nextPrevAudio(currentAudio - 1) });
            audioList.addEventListener('click', function (e) {
                if (e.target.classList.contains('single-audio')) {
                    audioDetailsUpadate(e.target.getAttribute('data-id'), true);

                } else if (e.target.parentNode.classList.contains('single-audio')) {
                    audioDetailsUpadate(e.target.parentNode.getAttribute('data-id'), true);

                }
            })
            audio.onended = function () {
                nextPrevAudio(currentAudio + 1);
            }
            audioDetailsUpadate(currentAudio, false);
        }

    }


}