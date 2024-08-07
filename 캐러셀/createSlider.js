function createSlider(target, viewCount, gap, transitionTime, autoPlay){
    target.classList.add('sbs-slider-container');
    // const viewCount = 2;
    // const gap = 8;
    // const transitionTime = 300;

    const contentsWrapper = document.createElement('div');
    contentsWrapper.classList.add('sbs-content-wrapper');
    
    
    // div.slider
    const slider = document.createElement('div');
    slider.classList.add('sbs-slider');

    // div.contents-wrapper
    

    // 1안. 실시간으로 1개씩 옮기다가 갯수가 0개가 되면 멈춘다.
    while(target.childElementCount !== 0) {
        target.firstElementChild.classList.add('sbs-content')
        contentsWrapper.appendChild(target.firstElementChild)
    }

    
    
    // 2안. 먼저 배열에 개체를 넣어놓고 나중에 옮기는 방법
    // const arr = [];

    // for(let i = 0 ; i < target.childElementCount ; i++){
    //     arr.push(target.children[i])
    // }

    // for(let i = 0 ; i < arr.length ; i ++) {
    //     contentsWrapper.appendChild(arr[i]);
    // }

    const slideCount = contentsWrapper.childElementCount;

    target.appendChild(slider)
    slider.appendChild(contentsWrapper);
    // 아래와 같은 모양이 된다.
        // div.slider-container > div.sllider > div.contents-wrapper

    const controls = document.createElement('div');
    controls.classList.add('sbs-controls');

    const prevButton = document.createElement('button');        
    const nextButton = document.createElement('button');    
    
    prevButton.classList.add('sbs-prev');
    nextButton.classList.add('sbs-next');

    prevButton.innerText = '이전';
    nextButton.innerText = '다음'
    const buttons = document.createElement('div');
    buttons.classList.add('sbs-buttons');

    controls.appendChild(prevButton)
    controls.appendChild(nextButton)
    controls.appendChild(buttons);

    target.appendChild(controls);






    

    const contentWidth = (slider.clientWidth - gap * (viewCount - 1)) / viewCount

    // 현재 뷰카운트가 달라지면 오작동하는 이슈가 있습니다.
    // 이는 뷰카운트 갯수만큼 클론을 만들어야 하는데
    // 기존의 작성은 viewCount가 1인 경우에만 올바르게 작동 되는 상황입니다.
    // 반복문을 이용해 viewCount의 갯수 만큼 clone을 만들어주면 해결 될 것 같은데,
    // 반복문을 한번만 쓰게되면 1 2 3 4 5 -> [1] [5] 1 2 3 4 5 [1] [5] 이런식으로 될것입니다.
    // 복사하는 부분과 끼워넣는 부분을 별도로 분리해서(for문 2개 이상 쓰라는 이야기)
    // 복사본을 적절한 위치에 잘 넣어보도록 합시다.

    // 퍼스트, 라스트 말고 개체.children[index]

    for(let i = 0 ; i < slideCount ; i ++ ){
        const button = document.createElement('div');
        button.classList.add('sbs-radio-button');
        button.addEventListener('click',()=>{
            index = viewCount + i;
            applyIndexToSlider(true)
        })

        buttons.appendChild(button);
    }

    buttons.children[0].classList.add('sbs-active');

    const cloneFirst = [];
    const cloneLast = [];

    for(let i = 0 ; i < viewCount ; i ++) {
        cloneFirst.push(contentsWrapper.children[i].cloneNode(true))
        cloneLast.push(contentsWrapper.children[contentsWrapper.childElementCount - 1 - i].cloneNode(true))
    }

    for(let i = 0 ; i < viewCount ; i ++) {
        contentsWrapper.appendChild(cloneFirst[i])
        contentsWrapper.insertBefore(cloneLast[i], contentsWrapper.firstElementChild)
    }

    // for(let i = 0 ; i < ??? ; ++) {
    //     contentsWrapper.appendChild(cloneFirst);
    //     contentsWrapper.insertBefore(cloneLast, contentsWrapper.firstElementChild);
    // }

    let index = viewCount ;
    let playAble = true;

    applyIndexToSlider(false);

    contentsWrapper.style.gap = `${gap}px`

    for(let i = 0 ; i < contentsWrapper.childElementCount ; i ++) {
        contentsWrapper.children[i].style.width = `${contentWidth}px`
    }


    
    prevButton.addEventListener('click',()=>{
        if(playAble){
            playAble=false;

            index--;
            applyIndexToSlider(true)

            setTimeout(() => {
                playAble=true;

                if(index === viewCount - 1) {
                    // transtion 지속시간만큼 시간이 흐른 뒤에
                    // transtion을 0으로 만들고, 좌표를 첫번째 슬라이드로 바꿔치기한다
                    index = contentsWrapper.childElementCount - viewCount - 1
                    applyIndexToSlider(false) 
                }
            }, transitionTime);

    }})


    
    if(autoPlay) {
        setInterval(() => {
            next();
        }, 5000);
    }


    nextButton.addEventListener('click', next)



    function next(){
        if(playAble){
            playAble=false;

            index++;
            applyIndexToSlider(true)

            setTimeout(() => {
                playAble=true;

                if(index === contentsWrapper.childElementCount-viewCount) {
                    // transtion 지속시간만큼 시간이 흐른 뒤에
                    // transtion을 0으로 만들고, 좌표를 첫번째 슬라이드로 바꿔치기한다
                    index = viewCount
                    applyIndexToSlider(false) 
                }
            }, transitionTime);
            
            // setTimeout(() => {
            //     playAble=true;
            //     console.log(playAble)
            // }, transitionTime);

            // // 만약 마지막 슬라이드(복사본)에 도달 했다면
            // if(index === contentsWrapper.childElementCount-viewCount) {
            //     // transtion 지속시간만큼 시간이 흐른 뒤에
            //     // transtion을 0으로 만들고, 좌표를 첫번째 슬라이드로 바꿔치기한다
            //     setTimeout(() => {
            //         index = viewCount
            //         applyIndexToSlider(false)

            //     }, transitionTime);
            // }
            

            // 만약 마지막 슬라이드(복사본)에 도달 했다면

        }
    }

    function applyIndexToSlider(animation){
        if(animation) {
            contentsWrapper.style.transition = `${transitionTime}ms`
        }else {
            contentsWrapper.style.transition = `none`
        }
        
        contentsWrapper.style.transform = `translateX(${index * -(contentWidth + gap)}px)`

        resetButtons();
        if(viewCount-1 === index){
            buttons.lastElementChild.classList.add('sbs-active');
        }else if(slideCount + viewCount === index) {
            buttons.firstElementChild.classList.add('sbs-active');
        }else {
            buttons.children[index-viewCount].classList.add('sbs-active');
        }

    }

    function resetButtons() {
        for(let i = 0 ; i < buttons.childElementCount ; i ++) {
            buttons.children[i].classList.remove('sbs-active');
        }
    }
}