#!/usr/bin/env zsh

# Quick and dirty script to extract all relevant images
# from PDF files in current directory.
# This is used for vendors such as SmartGames, who provide
# product assets as PDF files.

# TODO: Ensure availability of `pdfimage` (https://poppler.freedesktop.org/)
# TODO: Ensure availability of `md5`

for PDF_FILE_NAME in ./*.pdf; do
  BASE_FILE_NAME=$(basename "${PDF_FILE_NAME}" .pdf)

  # Extract all images from PDF file
  echo "🕵 Extracting all images from “${PDF_FILE_NAME}” …"
  pdfimages -all "${PDF_FILE_NAME}" "${BASE_FILE_NAME}"

  # Detect and remove non-relevant extracted images
  for IMAGE_FILE_NAME in ./${BASE_FILE_NAME}-*.*; do
    IMAGE_FILE_HASH=$(md5 -q "${IMAGE_FILE_NAME}")
    case "${IMAGE_FILE_HASH}" in
      b714e5c1b5c7b45f27d0687529823ab0|\
      e86fc4403a8f9d5b465d37eba8d1c24f|\
      d536e7164e12a23d405252cc6189452e|\
      653db0fd7936322005cdcdcff9803152|\
      ddb40929439b9bbd61b506443d72c713)
      # b714e5c1b5c7b45f27d0687529823ab0 # SmartGames “Age” pictogram
      # e86fc4403a8f9d5b465d37eba8d1c24f # SmartGames “Number of players” pictogram
      # d536e7164e12a23d405252cc6189452e # SmartGames “duration” pictogram
      # 653db0fd7936322005cdcdcff9803152 # “SmartGames” logo
      # ddb40929439b9bbd61b506443d72c713 # “Geosmart” logo
      echo "🚫 Removing non-relevant extracted image “${IMAGE_FILE_NAME}” …"
      rm "${IMAGE_FILE_NAME}"
    ;;
    esac
  done
done

echo "✨ All done."
