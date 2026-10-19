#!/bin/sh
set -eu

# Configure the site's working directory as the uploaded application directory.
# Keep data outside it so replacing a release cannot replace accounts or audio.
: "${IP:?The hosting site must provide its listening IP}"
: "${PORT:?The hosting site must provide its listening port}"
: "${ISMI_DATA_DIR:?Set ISMI_DATA_DIR to an absolute persistent data directory}"
case "$ISMI_DATA_DIR" in
    /*) ;;
    *) echo 'ISMI_DATA_DIR must be an absolute path.' >&2; exit 1 ;;
esac

umask 077
mkdir -p "$ISMI_DATA_DIR/recordings" "$ISMI_DATA_DIR/keys"
export ASPNETCORE_ENVIRONMENT=Production
# The host terminates TLS and forwards requests to this private HTTP listener.
export ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
export Database__Path="$ISMI_DATA_DIR/ismi.db"
export Recordings__Path="$ISMI_DATA_DIR/recordings"
export DataProtection__KeysPath="$ISMI_DATA_DIR/keys"
# Owner-authorized five-package exception on this development preview only.
# Omit this flag on any future beta host; the application default is disabled.
export Curriculum__AllowKhmerTextPreview=true
# Separate October 18 owner exception for five pinned French text-only lessons.
export Curriculum__AllowFrenchTextPreview=true
# Separate owner-authorized five-pack inventory-only alphabet exception.
export Curriculum__AllowAlphabetTextPreview=true
# Separate October 18 owner exception for one exact unreviewed story.
export Curriculum__AllowStoryTextPreview=true
# Reduce idle memory on the 256 MB free host; do not enable server GC.
export DOTNET_gcServer=0
case "$IP" in
    \[*\]) listen_host="$IP" ;;
    *:*) listen_host="[$IP]" ;;
    *) listen_host="$IP" ;;
esac
exec dotnet Ismi.Api.dll --urls "http://$listen_host:$PORT"
