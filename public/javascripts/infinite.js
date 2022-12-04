
const container = document.querySelector('.container')


window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    console.log({scrollTop, scrollHeight, clientHeight});

    if(clientHeight + scrollTop >= scrollHeight){
        console.log('to the bottom')
    }
})



    
      