from mezzanine.utils.views import render
from django.http import HttpResponse, Http404

from mezzanine.conf import settings

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

	context = {}
	template = 'roca/map.html'
	return render(request, template, context)
