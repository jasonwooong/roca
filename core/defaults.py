from django.utils.translation import ugettext_lazy as _

from mezzanine.conf import register_setting

register_setting(
    name="TEMPLATE_ACCESSIBLE_SETTINGS",
    description=_("Sequence of setting names available within templates."),
    editable=False,
    default=("COLOR_SPLASH", "DEFAULT_HEADER_PHOTO", "ENABLE_PARALLAX", "GOOGLE_ANALYTICS_KEY"),
    append=True,
)

register_setting(
    name="ENABLE_PARALLAX",
    label=_("Enable scrolling effect on header photo"),
    description=_("Disable this feature if experiencing performance issues"),
    editable=True,
    default=True,
)

register_setting(
    name="DEFAULT_HEADER_PHOTO",
    label=_("Default header photo"),
    description=_("Specify a default photo"),
    editable=True,
    default="/static/roca/header.jpg",
)

register_setting(
    name="COLOR_SPLASH",
    label=_("Randomly colorize navigation bar and blog post headers"),
    description=_("Enable this setting to randomly colorize top navigation bar and blog post links. (IE 9 and higher)"),
    editable=True,
    default=True,
)

register_setting(
	name="COMMENTS_USE_RATINGS",
    label=_("Rate comments"),
    description=_("Set TRUE to enable comment ratings.  False otherwise."),
    editable=False,
    default=False,
)

