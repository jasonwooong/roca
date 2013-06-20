from mezzanine.core.models import CONTENT_STATUS_PUBLISHED
from roca.blog.models import BlogPost

class MapPageMiddleware(object):

    def related_posts(self, page):
        """
        If related posts / categories are set then combine and 
        return all relevant posts.  Otherwise, return all posts.
        """
        posts = []

        page = page.get_content_model()

        if page.related_posts.count() or page.related_categories.count():
            rel_by_posts = page.related_posts.all()
            rel_by_cats = BlogPost.objects.filter(categories__in=page.related_categories.all())
            return (rel_by_posts | rel_by_cats).filter(status=CONTENT_STATUS_PUBLISHED, show_map=True)
        else:
            return BlogPost.objects.filter(status=CONTENT_STATUS_PUBLISHED, show_map=True)
        return posts

    def process_template_response(self, request, response):
        """
        Insert map data context into response if viewing map
        page content.
        """
        MAP_TEMPLATE = "map.html"

        template = []
        for r in response.template_name:
            template.append(r.split('/')[-1])
            
        if MAP_TEMPLATE not in template:
            return response

        blog_posts = self.related_posts(response.context_data['page'])
        map_data = []

        for blog in blog_posts:
            data = {
                'title': blog.title,
                'description': blog.description,
                'url': blog.get_absolute_url(),
                'latitude': blog.geo.latitude,
                'longitude': blog.geo.longitude
            }
            map_data.append(data)

        response.context_data['map_data'] = map_data

        return response