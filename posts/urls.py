from django.urls import path
from .views import (
    delete_post,
    Post_detail,
    load_post_data,
    picture_upload_view,
    post_list_create,
    like_post,
    post_detail_data,
    update_post,
    home_view
)

app_name = 'posts'

urlpatterns = [
    path('', home_view, name='home-view'),
    path('post/', post_list_create, name='post-list'),
    #path('hello-world/', hello_world_view, name='hello-world'),
    path('post-data/', load_post_data, name='load-data'),
    path('like-post/', like_post, name='like_post'),
    path('<pk>/', Post_detail, name='detail'),
    path('<pk>/data/', post_detail_data, name='post-data'),
    path('<pk>/update/', update_post , name='update'),
    path('<pk>/delete/', delete_post , name='delete'),
    path('upload/', picture_upload_view, name='data-upload')
]
