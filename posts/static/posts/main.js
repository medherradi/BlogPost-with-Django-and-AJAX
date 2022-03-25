
const postsBox = document.getElementById('posts-box')
const postForm = document.getElementById('post-form')

const title = document.getElementById('id_title')
const experience = document.getElementById('id_experience')
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0]
const alertBox = document.getElementById('alert-box')
const url = window.location.href
const myDrop = document.getElementById('my-drop')

//console.log(csrf.value)
// simple hello world with ajax call for testing the new update
/*$.ajax({
    type: 'GET',
    url: '/hello-world/', // from the url we're getting our json response
    success: function(response){
        console.log('success', response)
        helloWorldBox.textContent = response.text
    },
    error: function(error){
        console.log('error', error)
    }
})*/

const delPost = localStorage.getItem('title')
if (delPost){
    activateAlertBox('danger', `post "${delPost}" has been deleted`)
    localStorage.clear()
}

// AJAX call with csrf token 
const getCookie =(name) =>{
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likePosts = ()=>{
    const likeForm = [...document.getElementsByClassName('like-form')]
    likeForm.forEach(form=> form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickId = e.target.getAttribute('data-form-id')
        const clickBtn = document.getElementById(`like-btn-${clickId}`)
        $.ajax({
            type: 'POST',
            url: "/like-post/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickId,
            },
            success: function(response){
                console.log(response)
                clickBtn.innerHTML = response.liked ? `&#128077; <b>${response.count}</b>` : `&#x1F44D;&#x1F3FB;<b>${response.count}</b>`
            },
            error: function(error){
                console.log(error)
            },
        })
    }))
}

// Getting posts objects with ajax 
$.ajax({
    type:'GET',
    url: '/post-data/',
    success: function(response){
        console.log('success', response)
        //const data = JSON.parse(response.qs)
        //console.log(data)
        const data = response.data
        console.log(data)
        data.forEach(ele => {
            postsBox.innerHTML += `
            <div class="card column is-5 mx-2 my-2">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img class="is-rounded" src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${ele.author}</p>
                        <p class="subtitle is-6">@${ele.author}</p>
                    </div>
                </div>
                <div class="card-content">
                    <div class="content">
                        <b>${ele.title}</b><br>
                        <br>
                        <time><b>created</b> in <b>${ele.created}</b></time><br>
                        <time><b>last update</b> in <b>${ele.updated}</b></time>
                    </div>
                </div>
                <div class="card">
                    <footer class="card-footer">
                        <a href="${url}${ele.id}" class="card-footer-item"><b>Details</b></a>
                        <form class="like-form" data-form-id="${ele.id}">
                            <button href="#" id="like-btn-${ele.id}" class="card-footer-item">${ele.liked ? `&#128077;<b>${ele.count}</b>` : `&#x1F44D;&#x1F3FB;<b>${ele.count}</b>`}</button>
                        </form>
                    </footer>
                </div>    
            </div>
        `
        });
        likePosts()
    },
    error: function(error){
        console.log('error', error)
    }
})

let newPostId = null

postForm.addEventListener("submit", e=>{
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '',
        data:{
            'csrfmiddlewaretoken': csrf.value,
            'title': title.value,
            'experience': experience.value
        },
        success: function(response){
            console.log(response)
            newPostId = response.id
            postsBox.insertAdjacentHTML('afterbegin',`
            <div class="card column is-5 mx-2 my-2">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img class="is-rounded" src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${response.author}</p>
                        <p class="subtitle is-6">@${response.author}</p>
                    </div>
                </div>
                <div class="card-content">
                    <div class="content">
                        <b>${response.title}</b><br>
                        <br>
                        <time><b>created</b> in <b>${response.created}</b></time><br>
                        <time><b>last update</b> in <b>${response.updated}</b></time>
                    </div>
                </div>
                <div class="card">
                    <footer class="card-footer">
                        <a href="${url}${response.id}" class="card-footer-item"><b>Details</b></a>
                        <form class="like-form" data-form-id="${response.id}">
                            <button href="#" id="like-btn-${response.id}" class="card-footer-item"> &#x1F44D;&#x1F3FB;<b>${0}</b></button>
                        </form>
                    </footer>
                </div>    
            </div>
            `)
            likePosts()
            setTimeout(activateAlertBox('success', `Your post has been added successfully, <b>thank you for sharing your experience</b>, you can always <a>edit it</a>.`), 3000)
            postForm.reset()
        }, 
        error: function(error){
            console.log(error)
            activateAlertBox('danger', `Oops something went wrong, try again.`)
        }
    })
})

Dropzone.autoDiscover = false
const myDropzone = new Dropzone("#my-drop", {
    url: 'upload/',
    init: function() {
        this.on('sending', function(file, xhr, formData){
            console.log('newnew',newPostId)
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('id', newPostId)
        })
    },
    maxFiles: 5,
    maxFilesize: 4,
    acceptedFiles: '.png, .jpg, .jpeg'
})

// modal js trigger
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
      console.log($target);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });












