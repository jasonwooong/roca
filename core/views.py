from django.http import HttpResponse, Http404

from mezzanine.utils.views import render
from mezzanine.conf import settings

from roca.blog.models import BlogPost

def map(request):
    """

    Map view used for compiling all locations into single
    map canvas.  Each marker will represent a blog entry
    that takes a user directly to the post.  This feature
    will not work with the built in mezzanine.blog app
    and will return an HTTP 404 error if roca.blog is not
    detected.

    """
    if not "roca.blog" in settings.INSTALLED_APPS:
        if settings.DEBUG:
            raise Exception("Not installed")
        else:
            raise Http404

    blog_posts = BlogPost.objects.all()
    map_data = []

    for blog in blog_posts:
        data = {
            'title':    blog.title,
            'url':      blog.get_absolute_url(),
            'latitude': blog.geo.latitude,
            'longitude':blog.geo.longitude
        }
        map_data.append(data)

    context = {'map_data': map_data}
    template = 'roca/map.html'
    return render(request, template, context)
