from django.shortcuts import render, redirect
from .forms import LoginForm
from django.contrib.auth import authenticate, login, logout


def user_login_view(request):
      error_message = None
      form = LoginForm()
      if request.method == 'POST': 
            #print(request.POST)
            form = LoginForm(data = request.POST)
            if form.is_valid():
                  username = form.data.get('username')
                  password = form.data.get('password')
                  user = authenticate(username = username,
                                    password = password
                                    )
                  if user is not None:
                        login(request, user)
                        if request.GET.get('next'):
                              return redirect(request.GET.get('next'))
                        else: 
                              return redirect('posts:post-list')
                  else:
                        error_message = 'Something went wrong ... invalid login'      
      context = {
            'form': form,
            'error_message': error_message,
      }
      return render(request, 'login.html', context)


def user_logout_view(request):
      logout(request)
      return redirect('posts:home-view')
