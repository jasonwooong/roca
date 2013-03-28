from django.utils.translation import ugettext_lazy as _

from mezzanine.conf import register_setting

register_setting(
    name="DEFAULT_HEADER_PHOTO",
    label=_("Default header photo"),
    description=_("Specify a default photo"),
    editable=True,
    default="/static/roca/header.jpg",
)

register_setting(
	name="COMMENTS_USE_RATINGS",
    label=_("Rate comments"),
    description=_("Set TRUE to enable comment ratings.  False otherwise."),
    editable=False,
    default=False,
)