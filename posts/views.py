from django.shortcuts import render
from .models import Picture, Post
from django.http import HttpResponse, JsonResponse
from .utils import is_ajax
from .forms import PostForm
from profiles.models import Profile 
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect


# view to handle the Creation of post.

def home_view(request):
      return render(request, 'posts/home.html', {})


@login_required
def post_list_create(request):
    form = PostForm(request.POST or None)
    # query_set = Post.objects.all()
    if is_ajax(request=request):
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False) # means that we don't want to save the form just yet 
            instance.author = author 
            instance.save()
        return JsonResponse({
                'id': instance.id,
                'title': instance.title,
                'experience': instance.experience,
                'author': instance.author.user.username
            })
    context={ 
        #'qs': query_set,
        'form': form,
    }
    return render(request, 'posts/main_post.html', context)

# we need to prepare a separate 
# view to handle the ajax call 
# this view function return a jsonResponse
#def hello_world_view(request):
    #return JsonResponse({'text':'hello world'})


# now let's prepare a view to handle our database objects 
# and call ajax to retrieve it in the template
#@login_required
def load_post_data(request):
    query_set = Post.objects.all()
    # data = serializers.serialize('json', query_set)
    data = []
    for obj in query_set:
        item = {
            'id': obj.id,
            'title': obj.title,
            'experience': obj.experience,
            'author': obj.author.user.username,
            'liked': True if request.user in obj.liked.all() else False,
            'count': obj.like_count,
            'created': obj.created.date(),
            'updated': obj.updated.date()
        }
        data.append(item)
    return JsonResponse({'data': data})


# view to handle the logic behind the like button
@login_required
def like_post(request):
    if is_ajax(request=request):
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False  
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count':obj.like_count})
    return redirect('posts:home-view')



#@login_required
def Post_detail(request, pk):
    post_obj = Post.objects.get(pk = pk)
    form = PostForm()
    context= {
        'obj': post_obj,
        'form': form,
    }
    return render(request, 'posts/detail.html', context)


#@login_required
def post_detail_data(request, pk):
    if is_ajax(request=request):
        post_obj = Post.objects.get(pk = pk)
        data = {
            'id': post_obj.id,
            'title': post_obj.title,
            'experience': post_obj.experience,
            'author': post_obj.author.user.username,
            'picture': post_obj.author.picture.url,
            'logged_in': request.user.username,
        }
        return JsonResponse({'data': data})



# view to update a post
@login_required
#@action_permission
def update_post(request, pk):
    post = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        title = request.POST.get('title')
        experience = request.POST.get('experience')
        post.title = title 
        post.experience = experience
        post.save()
        return JsonResponse({
            'title': title,
            'experience': experience
            })
    return redirect('posts:home-view')


# view to delete post
@login_required
#@action_permission
def delete_post(request, pk):
    obj_post = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        obj_post.delete()
        return JsonResponse({})
    return redirect('posts:home-view')


# view to handle uploaded picture 
@login_required
#@action_permission
def picture_upload_view(request):
    if request.method == 'POST':
        pic = request.FILES.get('file')
        id = request.POST.get('id')
        post = Post.objects.get(id=id)
        Picture.objects.create(image=pic, post=post)
    return HttpResponse()










