from django.db import models
from django.utils.translation import ugettext_lazy as _

from mezzanine.conf import settings
from mezzanine.core.fields import FileField
from mezzanine.core.models import Displayable, Ownable, RichText, Slugged
from mezzanine.generic.fields import CommentsField, RatingField
from mezzanine.utils.models import AdminThumbMixin, upload_to
from mezzanine.pages.models import Page

from geoposition.fields import GeopositionField
from pygeocoder import Geocoder

try:
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ["^geoposition\.fields\.GeopositionField"])
except ImportError:
    pass

class BlogPost(Displayable, Ownable, RichText, AdminThumbMixin):
    """
    A blog post.
    """

    categories = models.ManyToManyField("BlogCategory",
                                        verbose_name=_("Categories"),
                                        blank=True, related_name="blogposts")
    allow_comments = models.BooleanField(verbose_name=_("Allow comments"),
                                         default=True)
    comments = CommentsField(verbose_name=_("Comments"))
    rating = RatingField(verbose_name=_("Rating"))
    featured_image = FileField(verbose_name=_("Featured Image"),
        upload_to=upload_to("blog.BlogPost.featured_image", "blog"),
        format="Image", max_length=255, null=True, blank=True)
    related_posts = models.ManyToManyField("self",
                                 verbose_name=_("Related posts"), blank=True)

    admin_thumb_field = "featured_image"

    geo = GeopositionField()
    show_location = models.BooleanField(verbose_name=_("Publish location"),
                                         default=False)
    show_map = models.BooleanField(verbose_name=_("Show map in post"),
                                         default=False)
    map_zoom = models.IntegerField(null=True, blank=True, default=0, help_text="Set zoom level for map (between 0 - 21)")

    class Meta:
        verbose_name = _("Blog post")
        verbose_name_plural = _("Blog posts")
        ordering = ("-publish_date",)

    @models.permalink
    def get_absolute_url(self):
        url_name = "blog_post_detail"
        kwargs = {"slug": self.slug}
        if settings.BLOG_URLS_USE_DATE:
            url_name = "blog_post_detail_date"
            month = str(self.publish_date.month)
            if len(month) == 1:
                month = "0" + month
            day = str(self.publish_date.day)
            if len(day) == 1:
                day = "0" + day
            kwargs.update({
                "day": day,
                "month": month,
                "year": self.publish_date.year,
            })
        return (url_name, (), kwargs)

    # These methods are wrappers for keyword and category access.
    # For Django 1.3, we manually assign keywords and categories
    # in the blog_post_list view, since we can't use Django 1.4's
    # prefetch_related method. Once we drop support for Django 1.3,
    # these can probably be removed.

    def category_list(self):
        return getattr(self, "_categories", self.categories.all())

    def keyword_list(self):
        try:
            return self._keywords
        except AttributeError:
            keywords = [k.keyword for k in self.keywords.all()]
            setattr(self, "_keywords", keywords)
            return self._keywords

    def reverse_geocode(self):
        try:
            geodata = Geocoder.reverse_geocode(self.geo.latitude, self.geo.longitude)
        except:
            return "unknown location"
        return "%s, %s" % (geodata.locality if geodata.locality else geodata.administrative_area_level_1, geodata.country)

class BlogCategory(Slugged):
    """
    A category for grouping blog posts into a series.
    """

    class Meta:
        verbose_name = _("Blog Category")
        verbose_name_plural = _("Blog Categories")
        ordering = ("title",)

    @models.permalink
    def get_absolute_url(self):
        return ("blog_post_list_category", (), {"category": self.slug})

class Map(Page, RichText):
    """
    Map view used for compiling all locations into single
    map canvas.  Each marker will represent a blog entry
    that takes a user directly to the post.
    """
    
    related_posts = models.ManyToManyField(BlogPost,
                                 verbose_name=_("Related posts"), blank=True)
    related_categories = models.ManyToManyField(BlogCategory,
                                 verbose_name=_("Related categories"), blank=True)

    class Meta:
        verbose_name = _("Map")
