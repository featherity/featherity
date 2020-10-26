import {Button, Flex, Link, Stack, Text,} from "@chakra-ui/core";
import download from "downloadjs";
import JSZip from "jszip";
import { Download, GitHub } from 'lucide-react';
import {IconCustomizerDrawer} from "./IconCustomizerDrawer";

function generateZip(icons) {
  const zip = new JSZip();
  Object.values(icons).forEach((icon) =>
    // @ts-ignore
    zip.file(`${icon.name}.svg`, icon.src)
  );
  return zip.generateAsync({ type: 'blob' });
}

const Header = ({ data }) => {
  const downloadAllIcons = async () => {

    const zip = await generateZip(data);
    download(zip, 'feather.zip');
  };

  const repositoryUrl = 'https://github.com/lucide-icons/lucide';

  return (
    <Flex direction="column" align="center" justify="center">
      <Text fontSize="3xl" as="b" mb="4" textAlign="center">
        Simply beautiful open source icons, community-sourced
      </Text>
      <Text fontSize="lg" as="p" textAlign="center" mb="8">
        An open-source icon library, a fork of <Link href="https://github.com/feathericons/feather" isExternal>Feather Icons</Link>. <br/>We're expanding the icon set as much as possible while keeping it nice-looking - <Link href={repositoryUrl} isExternal>join us</Link>!
      </Text>
      <Stack isInline marginTop={3} marginBottom={10}>
        <Button
          leftIcon={<Download/>}
          size="lg"
          onClick={downloadAllIcons}
        >
          Download all
        </Button>
        <IconCustomizerDrawer/>
        <Button
          as="a"
          leftIcon={<GitHub/>}
          size="lg"
          href={repositoryUrl}
          target="__blank"
          onClick={downloadAllIcons}
        >
          Github
        </Button>
      </Stack>
    </Flex>
  )
};

export default Header;
