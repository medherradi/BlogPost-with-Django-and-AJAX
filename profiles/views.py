from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from posts.utils import is_ajax
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def profile_view(request):
    obj = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, 
                       request.FILES or None, 
                       instance=obj)
    if is_ajax(request=request):
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio': instance.bio,
                'picture': instance.picture.url,
                'user': instance.user.username
            })
    context = {
        'obj':obj,
        'form': form,
    }
    return render(request, 'profiles/main.html', context)
