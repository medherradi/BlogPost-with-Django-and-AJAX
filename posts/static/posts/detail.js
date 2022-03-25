const backBtn = document.getElementById('back-btn')
const url = window.location.href + "data/"
const alertBox = document.getElementById('alert-box')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')
const postBox = document.getElementById('post-box')
const titleIn = document.getElementById('id_title')
const expIn = document.getElementById('id_experience')
const updateUrl = window.location.href + "update/"
//console.log(updateUrl)
const deleteUrl = window.location.href + "delete/"
const updateForm = document.getElementById('update-form')
const deleteForm = document .getElementById('delete-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0]


backBtn.addEventListener('click', ()=>{
    history.back()
})

$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        const data = response.data
        console.log(data)
        if (data.logged_in !== data.author){
            console.log('different')
        } else {
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }
        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class', 'mt-3')
        titleEl.setAttribute('id', 'title')
        const expEl = document.createElement('p')
        expEl.setAttribute('class', 'mt-1')
        expEl.setAttribute('id', 'experience')
        titleEl.textContent = data.title
        expEl.textContent = data.experience
        postBox.appendChild(titleEl)
        postBox.appendChild(expEl)
        titleIn.value = data.title
        expIn.value = data.experience
    },
    error: function(error){
        console.log(error)
    }
})



updateForm.addEventListener('submit', e=>{
    e.preventDefault()
    const title = document.getElementById('title')
    const experience = document.getElementById('experience')
    
    $.ajax({
      type: 'POST',
      url: updateUrl,
      data: {
        'csrfmiddlewaretoken': csrf.value, 
        'title': titleIn.value,
        'experience':expIn.value,
      },
      success: function(response){
        console.log(response)
        activateAlertBox('success', 'post has been updated')
        title.textContent = response.title
        experience.textContent = response.experience

      },
      error: function(error){
        console.log(error)
      }
    })
})



deleteForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
      type: 'POST',
      url: deleteUrl,
      data: {
        'csrfmiddlewaretoken': csrf.value,
      },
      success: function(reponse){
        window.location.href = window.location.origin
        localStorage.setItem('title', titleIn.value)
      },
      error: function(error){
        console.log(error)
      }
    })
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
    (document.querySelectorAll('.js-update-modal-trigger') || []).forEach(($trigger) => {
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
  (document.querySelectorAll('.js-delete-modal-trigger') || []).forEach(($trigger) => {
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

