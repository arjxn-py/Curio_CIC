const myform = document.forms.myForm;
const myBut = document.querySelector(".header-box button");
const video = document.querySelector(".video");

myBut.onclick = function(){
    video.setAttribute("src", myform.link.value);
};

const lt = document.querySelector("#low-time");
const ht = document.querySelector("#high-time");
const st = document.querySelector(".start-button");

let ask = 0;

function stop_it(){
    ask = 1;
    st.click();
}

st.onclick = function(){
    const numb = Number(ht.value)*1000 - Number(lt.value)*1000 + 1000;
    if(ask == 0){
        setTimeout(stop_it, numb);
        return 0;
    }
    ask = 0;
};

