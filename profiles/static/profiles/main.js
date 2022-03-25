console.log('hello world') 

const pictureBox = document.getElementById("picture-box")
const profileForm = document.getElementById("profile-form")
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0]
const bioInput = document.getElementById("id_bio")
const pictureInput = document.getElementById('id_picture')
const alertBox = document.getElementById('alert-box')


profileForm.addEventListener('submit', e=>{
    e.preventDefault()
    // we will send image and the best way is to use formData
    const formData = new FormData()
    formData.append('csrfmiddlewaretoken', csrf.value)
    formData.append('bio', bioInput.value)
    formData.append('picture', pictureInput.files[0])

    $.ajax({
        type: "POST",
        url: '', // this is 2 in 1 view so i will leave it empty 
        enctype: 'multipart/form-data',
        data: formData,
        success: function(response){
            console.log(response)
            bioInput.value = response.bio
            pictureBox.innerHTML = `
                <img class="has-ratio" width="500" height="220" src="${response.picture}" alt="${response.user}">
            `
            activateAlertBox('success', 'your profile has been updated')
        },
        error: function(error){
            console.log(error)
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})

